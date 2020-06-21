function random_heavy(tree_node) {
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
            // trovo il sottoalbero più grande e quello più piccolo
            if (tree_node.size_dx > tree_node.size_sx) {
                bigger_subtree = tree_node.dx
                smaller_subtree = tree_node.sx
            } else {
                bigger_subtree = tree_node.sx
                smaller_subtree = tree_node.dx
            }

            if (random_number > threshold) {
                smaller_subtree.rpoint = [0, 1]
                bigger_subtree.rpoint = [smaller_subtree.hlength + 1, 0]

                tree_node.hlength = bigger_subtree.hlength + smaller_subtree.hlength + 1

                if (bigger_subtree.vlength >= smaller_subtree.vlength + 1) {
                    tree_node.vlength = bigger_subtree.vlength
                } else {
                    tree_node.vlength = smaller_subtree.vlength + 1
                }
            } else {
                bigger_subtree.rpoint = [0, smaller_subtree.vlength + 1]
                smaller_subtree.rpoint = [1, 0]

                if (bigger_subtree.hlength >= smaller_subtree.hlength + 1) {
                    tree_node.hlength = bigger_subtree.hlength
                } else {
                    tree_node.hlength = smaller_subtree.hlength + 1
                }
                tree_node.vlength = bigger_subtree.vlength + smaller_subtree.vlength + 1
            }

        }

    }

}