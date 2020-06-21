function completely_random(tree_node) {
    if (tree_node === undefined) {
        return;
    }
    tree_node.rpoint = [0, 0]

    if (is_leaf(tree_node)) {
        tree_node.hlength = 0
        tree_node.vlength = 0
    } else {

        //disegno il primo sottoalbero
        completely_random(tree_node.sx, threshold)

        //disegno il secondo sottoalbero
        completely_random(tree_node.dx, threshold)

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