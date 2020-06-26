function labeled_absolute_points(tree_node, start_point) {

    if (tree_node === undefined) {
        return
    }
    // tree_node.apoint = sum_point(start_point, tree_node.rpoint)
    tree_node.apoint = sum_point(start_point, tree_node.rpoint)

    if (!is_leaf(tree_node)) {
        absolute_points(tree_node.sx, tree_node.apoint)
        absolute_points(tree_node.dx, tree_node.apoint)
    }

}

function labeled_draw_tree(tree_node) {

    var svg = d3.select("svg").select("#container")

    svg.selectAll("line")
        .data(tree_edges)
        .enter()
        .append("line")
        .transition()
        .duration(duration_enter)
        .attr("x1", edge => edge.source.apoint[0] * unit_length)
        .attr("y1", edge => edge.source.apoint[1] * unit_length)
        .attr("x2", edge => edge.target.apoint[0] * unit_length)
        .attr("y2", edge => edge.target.apoint[1] * unit_length)
        .attr("stroke", "red")
        .attr("stroke-width", 3)

    svg.selectAll("rect")
        .data(tree_node)
        .enter()
        .append("rect")
        .transition()
        .duration(duration_enter)
        .attr("x", node => node.apoint[0] * unit_length - (unit_length * node.label_size[0]/2))
        .attr("y", node => node.apoint[1] * unit_length - (unit_length * node.label_size[1]/2))
        .attr("width", node => node.label_size[0] * unit_length)
        .attr("height", node => node.label_size[1] * unit_length)
        .attr("fill", "white")
        .attr("stroke", "blue")
        .attr("stroke-width", 3)
        .on("end", function () {
            svg.selectAll("text")
                .data(tree_node)
                .enter()
                .append("text")
                .attr("x", node => node.apoint[0] * unit_length)
                .attr("y", node => node.apoint[1] * unit_length + 5)
                .text(node => node.label)
                .attr("style", "text-anchor: middle; font-size: 1000px;")
        })

}


function labeled_redraw_tree(tree_node) {

    var svg = d3.select("svg").select("#container")

    svg.selectAll("line")
        .data(tree_edges)
        .transition()
        .duration(duration_update)
        .attr("x1", edge => edge.source.apoint[0] * unit_length)
        .attr("y1", edge => edge.source.apoint[1] * unit_length)
        .attr("x2", edge => edge.target.apoint[0] * unit_length)
        .attr("y2", edge => edge.target.apoint[1] * unit_length)
        .attr("stroke", "red")
        .attr("stroke-width", 3)

    svg.selectAll("rect")
        .data(tree_node)
        .transition()
        .duration(duration_update)
        .attr("x", node => node.apoint[0] * unit_length - (unit_length * node.label_size[0]/2))
        .attr("y", node => node.apoint[1] * unit_length - (unit_length * node.label_size[1]/2))
        .attr("width", node => node.label_size[0] * unit_length)
        .attr("height", node => node.label_size[1] * unit_length)
        .attr("fill", "white")
        .attr("stroke", "blue")
        .attr("stroke-width", 3)

    svg.selectAll("text")
        .data(tree_node)
        .transition()
        .duration(duration_update)
        .attr("x", node => node.apoint[0] * unit_length)
        .attr("y", node => node.apoint[1] * unit_length + 5)
        .text(node => node.label)
        .attr("style", "text-anchor: middle; font-size: 100px;")


}

function labeled_draw() {
    var svg = d3.select("#canvas")
    svg.select("#container").selectAll('*').remove()

    d3.json(actual_filename)
        .then(function (data) {
            labeled_draw_from_data(data)
        })
}

function labeled_draw_from_data(data) {
    var svg = d3.select("#canvas")
    svg.select("#container").selectAll('*').remove()
    map_nodes = d3.map({})
    tree_edges.length = 0
    data.nodes.forEach(element => {
        let node = {}
        node.id = element.id
        node.label = element.label
        node.label_size = element.label_size

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
    labeled_absolute_points(tree, start_point)
    labeled_draw_tree(map_nodes.values())
}