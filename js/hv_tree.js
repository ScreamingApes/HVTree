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

    d3.json(actual_filename)
        .then(function (data) {
            draw_from_data(data)
        })
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
    absolute_points(tree, start_point)
    draw_tree(map_nodes.values())
}

function change_filename(filename) {
    actual_filename = `data/${filename}.json`
    tree_name = filename

    set_labels()
    draw()
}

function change_algorithm(algorithm) {
    actual_algorithm = algorithm
    if (["completely_random", "random_heavy"].indexOf(algorithm) != -1) {
        document.getElementById("slider").classList.remove("invisible")
    } else {
        document.getElementById("slider").classList.add("invisible")
    }
    
    set_labels()
    
    redraw()
}

function change_treshold(t) {
    threshold = t
    redraw()
}

function redraw() {
    window[actual_algorithm](tree)
    absolute_points(tree, start_point)
    redraw_tree(map_nodes.values())
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
    }
}

function restore_tree_name(){
    tree_name = prev_tree_name
    set_labels()
}

function set_labels(){
    var a = capitalizeFirstLetter(actual_algorithm)
    a = a.slice(0, a.indexOf("_")) + " " + a.charAt(a.indexOf("_") + 1).toUpperCase() + a.slice(a.indexOf("_") + 2)

    d3.select("#tree_name").text(capitalizeFirstLetter(tree_name + ":"))
    d3.select("#algorithm_name").text(a)
}

function capitalizeFirstLetter([first, ...rest]) {
    return first.toUpperCase() + rest.join("")
  }