var tree = {}
var map_nodes = d3.map({})
const width = window.innerWidth
const height = window.innerHeight
var actual_algorithm

function init() {
    actual_algorithm = 'right_heavy'
    actual_filename = 'data/tree30.json'
    // create svg
    var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("id", "canvas")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g")
        .attr("id", "container")
    draw(actual_filename)
}


function draw() {
    var svg = d3.select("#canvas")
    svg.select("#container").remove()
    svg.append("g").attr("id", "container")
    
    d3.json(actual_filename)
        .then(function (data) {
            map_nodes = d3.map({})
            data.nodes.forEach(element => {
                let node = {}
                node.id = element.id
                node.label = element.label
                if (element.id == 0) {
                    tree = node
                }

                map_nodes.set(node.id, node)
            });

            data.edges.forEach(element => {
                let source = map_nodes.get(element.source)
                let target = map_nodes.get(element.target)

                if (element.order === 0) {
                    source.sx = target
                } else {
                    source.dx = target
                }
            })

            size_subtrees(tree)
            window[actual_algorithm](tree)
            absolute_points(tree, start_point)
            draw_tree(map_nodes.values())
        })
}

function change_filename(filename){
    actual_filename = `data/${filename}.json`
    draw()
}

function change_algorithm(algorithm){
    actual_algorithm = algorithm
    draw()
}

function redraw(algorithm, ...args) {
    window[algorithm](tree, args)
    absolute_points(tree, start_point)
    redraw_tree(map_nodes.values())
}