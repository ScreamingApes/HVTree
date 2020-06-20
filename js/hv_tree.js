var tree = {}
var map_nodes = d3.map({})
const width = window.innerWidth
const height = window.innerHeight

function init() {
    // create svg
    var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("id", "canvas")
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g")
        .attr("id", "container")
    draw("data/tree30.json", 'right_heavy')
}


function draw(filename, algorithm) {
    d3.json(filename)
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
            window[algorithm](tree)
            absolute_points(tree, start_point)
            draw_tree(map_nodes.values())
        })
}

function redraw(algorithm, ...args) {
    window[algorithm](tree, args)
    absolute_points(tree, start_point)
    redraw_tree(map_nodes.values())
}