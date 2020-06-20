function right_heavy(tree_node) {

    if (tree_node === undefined) {
        return;
    }
    tree_node.rpoint = [0, 0]

    if (is_leaf(tree_node)) {
        tree_node.hlength = 0
    } else {

        //disegno il primo sottoalbero
        right_heavy(tree_node.sx)

        //disegno il secondo sottoalbero
        right_heavy(tree_node.dx)

        if (tree_node.sx === undefined) {
            tree_node.dx.rpoint = [1, 0]
            tree_node.hlength = tree_node.dx.hlength + 1
        } else if (tree_node.dx === undefined) {
            tree_node.sx.rpoint = [1, 0]
            tree_node.hlength = tree_node.sx.hlength + 1
        } else {

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

}