var max = Math.max

function labeled_ratio_heuristic(tree_node) {

    if (tree_node === undefined) {
        return;
    }
    tree_node.rpoint = [0, 0]

    const node_width = tree_node.label_size[0]
    const node_height = tree_node.label_size[1]

    const sx = tree_node.sx
    const dx = tree_node.dx

    if (is_leaf(tree_node)) {
        tree_node.hlength = node_width
        tree_node.vlength = node_height
        tree_node.offset = {x: tree_node.hlength / 2, y: tree_node.vlength / 2}
    } else {
        var center_label = { x: node_width / 2, y: node_height / 2 }
        
        //disegno il primo sottoalbero
        labeled_ratio_heuristic(tree_node.sx)

        //disegno il secondo sottoalbero
        labeled_ratio_heuristic(tree_node.dx)

        if (one_child(tree_node)) {
            var child = sx === undefined ? dx : sx

            // primo caso: child a destra a (1, 0)
            var h1 = node_width + 1 + child.hlength
            var v1 = max(center_label.y, child.offset.y) + max(center_label.y, child.vlength - child.offset.y)

            // secondo caso: child sotto a (0, 1)
            var h2 = max(center_label.x, child.offset.x) + max(center_label.x, child.hlength - child.offset.x)
            var v2 = node_height + 1 + child.vlength

            if (h1 / v1 <= h2 / v2) {
                // scelgo primo caso: child a destra a (1, 0)
                child.rpoint = [center_label.x + 1 + child.offset.x, 0]
                tree_node.hlength = h1
                tree_node.vlength = v1
                tree_node.offset = {x: center_label.x, y: max(center_label.y, child.offset.y)}

            } else {
                // scelgo secondo caso: child sotto a (0, 1)
                child.rpoint = [0, center_label.y + 1 + child.offset.y]
                tree_node.hlength = h2
                tree_node.vlength = v2
                tree_node.offset = {x: max(center_label.x, child.offset.x), y: center_label.y}

            }
        } else {

            // *************************************
            // caso 1: sx sotto di 1 e dx a destra 
            // *************************************
            
            var h1 = max(center_label.x, sx.offset.x) + max(center_label.x, sx.hlength - sx.offset.x) + 1 + dx.hlength
        
            var v1 = max(center_label.y, dx.offset.y) + max(center_label.y + 1 + sx.vlength, dx.vlength - dx.offset.y)

            // *************************************
            // caso 2: dx sotto di 1 e sx a destra
            // *************************************
            
            var h2 = max(center_label.x, dx.offset.x) + max(center_label.x, dx.hlength - dx.offset.x) + 1 + sx.hlength

            var v2 = max(center_label.y, sx.offset.y) + max(center_label.y + 1 + dx.vlength, sx.vlength - sx.offset.y)

            // *************************************
            // caso 3: dx a destra di 1 e sx sotto
            // *************************************
            
            var h3 = max(center_label.x, sx.offset.x) + max(center_label.x + 1 + dx.offset.x, sx.hlength - sx.offset.x)

            var v3 = max(center_label.y, dx.offset.y) + max(center_label.y, dx.vlength - dx.offset.y) + 1 + sx.vlength
            
            // *************************************
            // caso 4: sx a destra di 1 e dx sotto
            // *************************************

            var h4 = max(center_label.x, dx.offset.x) + max(center_label.x + 1 + sx.offset.x, dx.hlength - dx.offset.x)

            var v4 = max(center_label.y, sx.offset.y) + max(center_label.y, sx.vlength - sx.offset.y) + 1 + dx.vlength
                        
            // seleziono la ratio più vicina ad 1
            var ratio = [h1 / v1, h2 / v2, h3 / v3, h4 / v4]

            switch (nearest_to_one(ratio)) {
                case 0:
                    // caso 1: sx sotto di 1 e dx a destra
                  
                    sx.rpoint = [0, center_label.y + 1 + sx.offset.y]
                    dx.rpoint = [max(center_label.x, sx.hlength - sx.offset.x) + 1 + dx.offset.x, 0]
                    tree_node.offset = {x: max(sx.offset.x, center_label.x), y: max(dx.offset.y, center_label.y)}
                    tree_node.hlength = h1
                    tree_node.vlength = v1
                    break;
                case 1:
                    // caso 2: dx sotto di 1 e sx a destra
                  
                    tree_node.sx.rpoint = [max(center_label.x, dx.hlength - dx.offset.x) + 1 + sx.offset.x, 0]
                    tree_node.dx.rpoint = [0, center_label.y + 1 + dx.offset.y]
                    tree_node.offset = {x: max(dx.offset.x, center_label.x), y: max(sx.offset.y, center_label.y)}
                    tree_node.hlength = h2
                    tree_node.vlength = v2
                    break;
                case 2:
                    // caso 3: dx a destra di 1 e sx sotto
                  
                    tree_node.sx.rpoint = [0, 1 + max(center_label.y, dx.vlength - dx.offset.y) + 1 + sx.offset.y]
                    tree_node.dx.rpoint = [center_label.x + 1 + dx.offset.x, 0]
                    tree_node.offset = {x: max(sx.offset.x, center_label.x), y: max(dx.offset.y, center_label.y)}
                    tree_node.hlength = h3
                    tree_node.vlength = v3
                    break;
                case 3:
                    // caso 4: sx a destra di 1 e dx sotto
                   
                    tree_node.sx.rpoint = [center_label.x + 1 + sx.offset.x, 0]
                    tree_node.dx.rpoint = [0, 1 + max(center_label.y, sx.vlength - sx.offset.y) + dx.offset.y]
                    tree_node.offset = {x: max(dx.offset.x, center_label.x), y: max(sx.offset.y, center_label.y)}
                    tree_node.hlength = h4
                    tree_node.vlength = v4
                    break;
            }
        }
    }
} 