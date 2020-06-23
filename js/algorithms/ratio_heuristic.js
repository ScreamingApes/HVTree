function ratio_heuristic(tree_node) {

    if (tree_node === undefined) {
        return;
    }
    tree_node.rpoint = [0, 0]

    if (is_leaf(tree_node)) {
        tree_node.hlength = 0
        tree_node.vlength = 0
    } else {

        //disegno il primo sottoalbero
        ratio_heuristic(tree_node.sx)

        //disegno il secondo sottoalbero
        ratio_heuristic(tree_node.dx)

        if (one_child(tree_node)) {
            child = tree_node.sx === undefined ? tree_node.dx : tree_node.sx

            // primo caso: child a destra a (1, 0)
            var h1 = child.hlength + 1
            var v1 = child.vlength

            // secondo caso: child sotto a (0, 1)
            var h2 = child.hlength
            var v2 = child.vlength + 1

            if (h1 / v1 <= h2 / v2) {
                // scelgo primo caso: child a destra a (1, 0)
                child.rpoint = [1, 0]
                tree_node.hlength = h1
                tree_node.vlength = v1
            } else {
                // scelgo secondo caso: child sotto a (0, 1)
                child.rpoint = [0, 1]
                tree_node.hlength = h2
                tree_node.vlength = v2
            }

        } else {
            var h_dx = tree_node.dx.hlength
            var v_dx = tree_node.dx.vlength
            var h_sx = tree_node.sx.hlength
            var v_sx = tree_node.sx.vlength

            var h1, v1, h2, v2

            // primo caso: dx a destra a (1, 0) e sx in basso a (0, v_dx+1)

            if (h_sx >= h_dx + 1) {
                h1 = h_sx
            } else {
                h1 = h_dx + 1
            }

            v1 = v_dx + v_sx + 1

            // secondo caso: sx a destra a (1, 0) e dx in basso a (0, v_sx+1)

            if (h_dx >= h_sx + 1) {
                h2 = h_dx
            } else {
                h2 = h_sx + 1
            }

            v2 = v_dx + v_sx + 1

            // terzo caso: dx a destra a (h_sx+1, 0) e sx in basso a (0, 1)
            h3 = h_sx + h_dx + 1

            if (v_dx >= v_sx + 1) {
                v3 = v_dx
            } else {
                v3 = v_sx + 1
            }

            // quarto caso: sx a destra a (h_dx+1, 0) e dx in basso a (0, 1)
            h4 = h_sx + h_dx + 1

            if (v_sx >= v_dx + 1) {
                v4 = v_sx
            } else {
                v4 = v_dx + 1
            }

            var area = [h1 / v1, h2 / v2, h3 / v3, h4 / v4]

            switch (nearest_to_one(area)) {
                case 0:
                    // primo caso: dx a destra a (1, 0) e sx in basso a (0, v_dx+1)
                    tree_node.dx.rpoint = [1, 0]
                    tree_node.sx.rpoint = [0, v_dx + 1]

                    tree_node.hlength = h1
                    tree_node.vlength = v1
                    break;
                case 1:
                    // secondo caso: sx a destra a (1, 0) e dx in basso a (0, v_sx+1)
                    tree_node.dx.rpoint = [0, v_sx + 1]
                    tree_node.sx.rpoint = [1, 0]

                    tree_node.hlength = h2
                    tree_node.vlength = v2
                    break;
                case 2:
                    // terzo caso: dx a destra a (h_sx+1, 0) e sx in basso a (0, 1)
                    tree_node.dx.rpoint = [h_sx + 1, 0]
                    tree_node.sx.rpoint = [0, 1]

                    tree_node.hlength = h3
                    tree_node.vlength = v3
                    break;
                case 3:
                    // quarto caso: sx a destra a (h_dx+1, 0) e dx in basso a (0, 1)
                    tree_node.dx.rpoint = [0, 1]
                    tree_node.sx.rpoint = [h_dx + 1, 0]

                    tree_node.hlength = h4
                    tree_node.vlength = v4
                    break;
            }

        }

    }

} 

function nearest_to_one(array) {
    return d3.minIndex(array.map(elem => Math.abs(1 - elem)))
}
