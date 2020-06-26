var tree = {}
var map_nodes = d3.map({})
var tree_edges = []
const width = window.innerWidth
const height = window.innerHeight
var actual_algorithm
var actual_filename
var threshold = 0.5
var reader = new FileReader()
var depth = 0

function get_inner_size() {
    return [window.innerWidth, window.innerHeight - document.getElementsByClassName("navbar")[0].clientHeight]
}

function init() {
    actual_algorithm = 'right_heavy'
    actual_filename = 'data/tree30.json'
    tree_name = "tree30"

    set_labels()

    // create svg
    var svg = d3.select("#canvas").attr("width", width).attr("height", height)
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g")
        .attr("id", "container")
    draw()

    const $valueSpan = $('.valueSpan2');
    const $value = $('#customRange11');
    $valueSpan.html($value.val());
    $value.on('input change', () => {
        $valueSpan.html($value.val());
    });

    window.onresize = function () {
        const [width, height] = get_inner_size()
        var svg = d3.select("#canvas").attr("width", width).attr("height", height)
    }
}

function change_json() {
    var file = document.querySelector('input[type=file]').files[0]
    reader.addEventListener("load", draw_file, false)
    if (file) {
        reader.readAsText(file)
        tree_name = file.replace(".json", "")
        set_labels()
    }
}

function draw_file() {
    var svg = d3.select("#canvas")
    svg.select("#container").selectAll('*').remove()
    draw_from_data(JSON.parse(reader.result))
}

function draw() {
    var svg = d3.select("#canvas")
    svg.select("#container").selectAll('*').remove()

    if (actual_filename === "") {
        size_subtrees(tree)
        window[actual_algorithm](tree)
        absolute_points(tree, get_start_point())
        draw_tree()
    } else {
        d3.json(actual_filename)
            .then(function (data) {
                draw_from_data(data)
            })
    }

}

function draw_from_data(data) {
    var svg = d3.select("#canvas")
    svg.select("#container").selectAll('*').remove()
    map_nodes = d3.map({})
    tree_edges.length = 0
    data.nodes.forEach(element => {
        let node = {}
        node.id = element.id
        node.label = element.label
        node.label_size = element.label_size
        node.offset = { x: 0, y: 0 }

        if (element.id == 0) {
            tree = node
        }

        map_nodes.set(node.id, node)
    })

    data.edges.forEach(element => {
        let source = map_nodes.get(element.source)
        let target = map_nodes.get(element.target)

        tree_edges.push({ source: source, target: target })

        if (element.order === 0) {
            source.sx = target
        }
        else {
            source.dx = target
        }
    })
    size_subtrees(tree)
    window[actual_algorithm](tree)
    absolute_points(tree, get_start_point())
    draw_tree()
}

function get_start_point() {
    return [1 + tree.offset.x, 1 + tree.offset.y]
}

function change_filename(filename) {
    actual_filename = `data/${filename}.json`
    tree_name = filename

    set_labels()

    draw()
}

function change_algorithm(algorithm) {

    var prec_algorithm = actual_algorithm

    actual_algorithm = algorithm
    if (["completely_random", "random_heavy"].indexOf(algorithm) != -1) {
        document.getElementById("slider").classList.remove("invisible")
    } else {
        document.getElementById("slider").classList.add("invisible")
    }

    set_labels()

    if (algorithm === "labeled_ratio_heuristic" || prec_algorithm == "labeled_ratio_heuristic") {
        d3.select("#zoom_reset").on("click")()
        draw()
    } else {
        redraw()
    }
}

function change_treshold(t) {
    threshold = t
    redraw()
}

function redraw() {
    window[actual_algorithm](tree)
    absolute_points(tree, get_start_point())
    redraw_tree()
}

function change_depth(d) {
    set_labels()
    depth = d
}
function create_complete_tree() {
    if (depth > 0) {
        data = complete_tree(depth)
        var svg = d3.select("#canvas")
        svg.select("#container").selectAll('*').remove()
        draw_from_data(data)
        prev_tree_name = tree_name
        tree_name = "complete tree with depth " + depth
        set_labels()
        actual_filename = ""
    }
}

function restore_tree_name() {
    tree_name = prev_tree_name
    set_labels()
}

function set_labels() {
    var capitalizeFirstLetter = ([first, ...rest]) => first.toUpperCase() + rest.join("")
    var algorithm_name = actual_algorithm.split('_').map(capitalizeFirstLetter).join(" ")
    d3.select("#tree_name").text(capitalizeFirstLetter(tree_name + ":"))
    d3.select("#algorithm_name").text(algorithm_name)
}
