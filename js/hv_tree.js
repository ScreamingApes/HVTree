var tree = {}
var map_nodes = d3.map({})
const width = window.innerWidth
const height = window.innerHeight

function main() {
    d3.json("data/tree30.json")
        .then(function (data) {
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
            d3.select("body").append("svg").attr("width", width).attr("height", height)
            size_subtrees(tree)
            right_heavy(tree)
            absolute_points(tree, start_point)
            draw_tree(map_nodes.values())
        })
}