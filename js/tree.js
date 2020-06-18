var tree = {}
var map_nodes = d3.map({})
const unit_length = 20

d3.json("data/input.json")
    .then(function (data) {
        data.nodes.forEach(element => {
            let node = {}
            node.id = element.id

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
    })

is_leaf = (tree_node) => tree_node.sx === undefined && tree_node.dx === undefined
sum_point = (point1, point2) => [point1[0] + point2[0], point1[1] + point2[1]]

function size_subtrees(tree_node) {
    if (tree_node === undefined) {
        return 0;
    } else {
        tree_node.size_dx = size_subtrees(tree_node.dx)
        tree_node.size_sx = size_subtrees(tree_node.sx)
        return tree_node.size_dx + tree_node.size_sx + 1
    }
}

function right_heavy(tree_node) {
    tree_node.rpoint = [0, 0]

    if (is_leaf(tree_node)) {
        tree_node.hlength = 0
    } else {

        //disegno il primo sottoalbero
        right_heavy(tree_node.sx)

        //disegno il secondo sottoalbero
        right_heavy(tree_node.dx)

        if (tree_node.size_dx > tree_node.size_sx) {
            tree_node.sx.rpoint = [0, 1]
            tree_node.dx.rpoint = [tree_node.sx.hlength + 1, 0]
        } else {
            tree_node.dx.rpoint = [0, 1]
            tree_node.sx.rpoint = [tree_node.dx.hlength + 1, 0]
        }

        tree_node.hlength = tree_node.dx.hlength + tree_node.sx.hlength + 1

    }

}

function absolute_points(tree_node, start_point) {

    tree_node.apoint = sum_point(start_point, tree_node.rpoint)
    if (!is_leaf(tree_node)) {
        absolute_points(tree_node.sx, tree_node.apoint)
        absolute_points(tree_node.dx, tree_node.apoint)
    }

}

function draw_tree(tree_node) {

    var svg = d3.select("svg")

    svg.selectAll("circle")
        .data(tree_node)
        .enter()
        .append("circle")
        .attr("cx", node => node.apoint[0] * unit_length)
        .attr("cy", node => node.apoint[1] * unit_length)
        .attr("r", 4)
}

function all() {
    d3.select("body").append("svg").attr("width", 500).attr("height", 500)
    right_heavy(tree)
    absolute_points(tree, [10, 10])
    draw_tree(map_nodes.values())
}