var tree = {}
var map_nodes = d3.map({})
const unit_length = 50
const start_point = [1, 1]
const radius = 15
const width = window.innerWidth
const height = window.innerHeight

is_leaf = (tree_node) => tree_node.sx === undefined && tree_node.dx === undefined
sum_point = (point1, point2) => [point1[0] + point2[0], point1[1] + point2[1]]
one_child = (tree_node) => tree_node.sx === undefined || tree_node.dx === undefined

function size_subtrees(tree_node) {
    if (tree_node === undefined) {
        return 0;
    } else {
        tree_node.size_dx = size_subtrees(tree_node.dx)
        tree_node.size_sx = size_subtrees(tree_node.sx)
        return tree_node.size_dx + tree_node.size_sx + 1
    }
}

function random_heavy(tree_node, threshold) {
    if (tree_node === undefined) {
        return;
    }
    tree_node.rpoint = [0, 0]

    if (is_leaf(tree_node)) {
        tree_node.hlength = 0
        tree_node.vlength = 0
    } else {

        //disegno il primo sottoalbero
        random_heavy(tree_node.sx, threshold)

        //disegno il secondo sottoalbero
        random_heavy(tree_node.dx, threshold)

        random_number = Math.random()

        if (one_child(tree_node)) {
            child = tree_node.sx === undefined ? tree_node.dx : tree_node.sx
            if (random_number > threshold) {
                child.rpoint = [1, 0]
                tree_node.hlength = child.hlength + 1
                tree_node.vlength = child.vlength
            } else {
                child.rpoint = [0, 1]
                tree_node.hlength = child.hlength
                tree_node.vlength = child.vlength + 1
            }

        } else {
            if (random_number > threshold) {
                tree_node.sx.rpoint = [0, 1]
                tree_node.dx.rpoint = [tree_node.sx.hlength + 1, 0]

                tree_node.hlength = tree_node.dx.hlength + tree_node.sx.hlength + 1

                if (tree_node.dx.vlength >= tree_node.sx.vlength + 1) {
                    tree_node.vlength = tree_node.dx.vlength
                } else {
                    tree_node.vlength = tree_node.sx.vlength + 1
                }
            } else {
                tree_node.dx.rpoint = [0, tree_node.sx.vlength + 1]
                tree_node.sx.rpoint = [1, 0]

                if (tree_node.dx.hlength >= tree_node.sx.hlength + 1) {
                    tree_node.hlength = tree_node.dx.hlength
                } else {
                    tree_node.hlength = tree_node.sx.hlength + 1
                }
                tree_node.vlength = tree_node.dx.vlength + tree_node.sx.vlength + 1
            }

        }

    }

}

function absolute_points(tree_node, start_point) {

    if (tree_node === undefined) {
        return
    }

    tree_node.apoint = sum_point(start_point, tree_node.rpoint)

    if (!is_leaf(tree_node)) {
        absolute_points(tree_node.sx, tree_node.apoint)
        absolute_points(tree_node.dx, tree_node.apoint)
    }

}

function get_edges(tree_node) {
    var edges = []

    function g_e(tree_node) {
        if (tree_node === undefined) {
            return;
        }
        if (!is_leaf(tree_node)) {
            if (tree_node.sx !== undefined)
                edges.push({ start: tree_node.apoint, end: tree_node.sx.apoint })
            if (tree_node.dx !== undefined)
                edges.push({ start: tree_node.apoint, end: tree_node.dx.apoint })
            g_e(tree_node.sx)
            g_e(tree_node.dx)
        }
    }

    g_e(tree_node)
    return edges
}

function draw_tree(tree_node) {

    var svg = d3.select("svg")
    var edges = get_edges(tree)

    svg.selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("x1", edge => edge.start[0] * unit_length)
        .attr("y1", edge => edge.start[1] * unit_length)
        .attr("x2", edge => edge.end[0] * unit_length)
        .attr("y2", edge => edge.end[1] * unit_length)
        .attr("stroke", "red")
        .attr("stroke-width", 3)

    svg.selectAll("circle")
        .data(tree_node)
        .enter()
        .append("circle")
        .attr("cx", node => node.apoint[0] * unit_length)
        .attr("cy", node => node.apoint[1] * unit_length)
        .attr("r", radius)
        .attr("fill", "white")
        .attr("stroke", "blue")
        .attr("stroke-width", 3)

    svg.selectAll("text")
        .data(tree_node)
        .enter()
        .append("text")
        .attr("x", node => node.apoint[0] * unit_length)
        .attr("y", node => node.apoint[1] * unit_length + 5)
        .text(node => node.label)
        .attr("style", "text-anchor: middle;")


}

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
            random_heavy(tree, 0.64)
            absolute_points(tree, start_point)
            draw_tree(map_nodes.values())
        })
}