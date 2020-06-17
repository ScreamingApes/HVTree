is_leaf(tree_node) = tree_node.sx === null && tree_node.dxx === null
sum_point(point1, point2) = [point1[0] + point2[0], point1[1] + point2[1]]


function right_heavy(tree_node) {

    if (is_leaf(tree_node)) {
        tree_node.hlength = 0
        tree_node.rpoint = [0, 0]
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