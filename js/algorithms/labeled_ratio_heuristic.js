function rect_intersection(rect1, rect2) {

    r1 = { offset: [rect1.offset[0], rect1.offset[1]], width: rect1.label_size[0], height: rect1.label_size[1] }
    r2 = { offset: [rect2.offset[0], rect2.offset[1]], width: rect2.label_size[0], height: rect2.label_size[1] }
    var max_offset = [Math.max(r1.offset[0], r2.offset[0]), Math.max(r1.offset[1], r2.offset[1])]

    r = [r1, r2]
    for (var i in r) {
        r[i].offset[0] = max_offset[0] - r[i].offset[0]
        r[i].offset[1] = max_offset[1] - r[i].offset[1]
    }

    // r.forEach(e => {
    //     e.offset[0] = max_offset[0] - e.offset[0]
    //     e.offset[1] = max_offset[1] - e.offset[1]
    // });

    // calcolo i 2 punti di ogni rettangolo
    function points(rect) {
        const ul = [...rect.offset]
        const br = [ul[0] + rect.width, ul[1] + rect.height]
        return [ul, br]
    }

    var p1 = points(r1)
    var p2 = points(r2)

    var xs = p1.concat(p2).map(x => x[0])
    var ys = p1.concat(p2).map(x => x[1])

    var center_x = xs.sort(d3.ascending)
    var center_y = ys.sort(d3.ascending)

    var ul = [center_x[1], center_y[1]]
    var br = [center_x[2], center_y[2]]
    var rect = { hlength: br[0] - ul[0], vlength: br[1] - ul[1] }

    return rect
}

function labeled_ratio_heuristic(tree_node) {

    if (tree_node === undefined) {
        return;
    }
    tree_node.rpoint = [0, 0]

    if (is_leaf(tree_node)) {
        tree_node.hlength = tree_node.label_size[0]
        tree_node.vlength = tree_node.label_size[1]
        tree_node.offset = [tree_node.hlength / 2, tree_node.vlength / 2]
    } else {

        //disegno il primo sottoalbero
        labeled_ratio_heuristic(tree_node.sx)

        //disegno il secondo sottoalbero
        labeled_ratio_heuristic(tree_node.dx)

        if (one_child(tree_node)) {
            child = tree_node.sx === undefined ? tree_node.dx : tree_node.sx
            rect_int = rect_intersection(child, { offset: [tree_node.label_size[0] / 2, tree_node.label_size[1] / 2], label_size: tree_node.label_size })
            // primo caso: child a destra a (1, 0)
            var h1 = tree_node.label_size[0] + 1 + child.hlength
            var v1 = rect_int.vlength + (child.vlength - rect_int.vlength) + (tree_node.label_size[1] - rect_int.vlength)


            // secondo caso: child sotto a (0, 1)
            var h2 = rect_int.hlength + (child.hlength - rect_int.hlength) + (tree_node.label_size[0] - rect_int.hlength)
            var v2 = tree_node.label_size[1] + 1 + child.vlength


            if (h1 / v1 <= h2 / v2) {
                // scelgo primo caso: child a destra a (1, 0)
                child.rpoint = [tree_node.label_size[0] / 2 + 1 + child.offset[0], 0]
                tree_node.hlength = h1
                tree_node.vlength = v1
                tree_node.offset = [tree_node.label_size[0] / 2, Math.max(tree_node.label_size[1] / 2, child.offset[1])]
            } else {
                // scelgo secondo caso: child sotto a (0, 1)
                child.rpoint = [0, tree_node.label_size[1] / 2 + 1 + child.offset[1]]
                tree_node.hlength = h2
                tree_node.vlength = v2
                tree_node.offset = [Math.max(tree_node.label_size[0] / 2, child.offset[0]), tree_node.label_size[1] / 2]
            }
        } else {
            // calcolo l'intersezione
            rect_int = rect_intersection(tree_node.sx, tree_node.dx)

            // *************************************
            // caso 1: sx sotto di 1 e ds a destra 
            // *************************************

            // CALCOLO H_LENGTH
            // h_length = max(tree_node.label_size[0]/2, tree_node.sx.offset[0]) + max(tree_node.label_size[0]/2, tree_node.sx.hlength - tree_node.sx.offset[0]) + 1 + tree_node.dx.offset[0]

            h1 = Math.max(tree_node.label_size[0] / 2, tree_node.sx.offset[0]) + Math.max(tree_node.label_size[0] / 2, tree_node.sx.hlength - tree_node.sx.offset[0]) + 1 + tree_node.dx.offset[0]

            // CALCOLO V_LENGTH
            // rect_int <- intersezione(rect_sx, rect_dx)
            // v_length = rect_int.v_length + (dx.v_length - rect_int.v_length) + (sx.v_length - rect_int.v_length)

            v1 = rect_int.vlength + (tree_node.dx.vlength - rect_int.vlength) + (tree_node.sx.vlength - rect_int.vlength)


            // *************************************
            // caso 2: dx sotto di 1 e sx a destra
            // *************************************

            // h_length = max(tree_node.label_size[0]/2, tree_node.dx.offset[0]) + max(tree_node.label_size[0]/2, tree_node.dx.hlength - tree_node.dx.offset[0]) + 1 + tree_node.sx.offset[0]   

            h1 = Math.max(tree_node.label_size[0] / 2, tree_node.dx.offset[0]) + Math.max(tree_node.label_size[0] / 2, tree_node.dx.hlength - tree_node.dx.offset[0]) + 1 + tree_node.sx.offset[0]


            // CALCOLO V_LENGTH
            // rect_int <- intersezione(rect_sx, rect_dx)
            // v_length = rect_int.v_length + (dx.v_length - rect_int.v_length) + (sx.v_length - rect_int.v_length)

            v2 = rect_int.vlength + (tree_node.dx.vlength - rect_int.vlength) + (tree_node.sx.vlength - rect_int.vlength)


            // *************************************
            // caso 3: dx a destra di 1 e sx sotto
            // *************************************

            // CALCOLO H_LENGTH
            // rect_int <- intersezione(rect_sx, rect_dx)
            // h_length = rect_int.h_length + (dx.h_length - rect_int.h_length) + (sx.h_lenght - rect_int.h_length)

            h3 = rect_int.hlength + (tree_node.dx.hlength - rect_int.hlength) + (tree_node.sx.hlength - rect_int.hlength)

            // CALCOLO V_LENGTH
            // se dx.offset.y > tree_node.label_size[1]
            //      v_length = dx.v_length + 1 + sx.v_length
            // altrimenti
            //      v_length = tree_node.label_size[1] / 2 + dx.v_length - dx.offset.y + 1 + sx.v_length

            if (tree_node.dx.offset[1] > tree_node.label_size[1]) {
                v3 = tree_node.dx.vlength + tree_node.sx.vlength + 1
            } else {
                v3 = tree_node.label_size[1] / 2 + tree_node.dx.vlength - tree_node.dx.offset[1] + 1 + tree_node.sx.vlength
            }


            // *************************************
            // caso 4: sx a destra di 1 e dx sotto
            // *************************************


            // CALCOLO H_LENGTH
            // rect_int <- intersezione(rect_sx, rect_dx)
            // h_length = rect_int.h_length + (dx.h_length - rect_int.h_length) + (sx.h_lenght - rect_int.h_length)

            h4 = rect_int.hlength + (tree_node.dx.hlength - rect_int.hlength) + (tree_node.sx.hlength - rect_int.hlength)

            // CALCOLO V_LENGTH
            // se sx.offset.y > tree_node.label_size[1]
            //      v_length = dx.v_length + 1 + sx.v_length
            // altrimenti
            //      v_length = tree_node.label_size[1] / 2 + sx.v_length - sx.offset.y + 1 + dx.v_length

            if (tree_node.sx.offset[1] > tree_node.label_size[1]) {
                v4 = tree_node.dx.vlength + tree_node.sx.vlength + 1
            } else {
                v4 = tree_node.label_size[1] / 2 + tree_node.sx.vlength - tree_node.sx.offset[1] + 1 + tree_node.dx.vlength
            }

            // ratio vicino ad 1

            var ratio = [h1 / v1, h2 / v2, h3 / v3, h4 / v4]

            switch (nearest_to_one(ratio)) {
                case 0:
                    // caso 1: sx sotto di 1 e dx a destra
                    // sx.rpoint = [0, tree_node.label_size[1] / 2 + 1 + sx.offset.y]
                    // dx.rpoint = [sx.h_length - sx.offset.x + 1 + dx.offset.x, 0]
                    // tree_node.offset.x = Math.max(sx.offset.x, tree_node.label_size[0])
                    // tree_node.offset.y = Math.max(dx.offset.y, tree_node.label_size[1])

                    tree_node.sx.rpoint = [0, tree_node.label_size[1] / 2 + 1 + tree_node.sx.offset[1]]
                    tree_node.dx.rpoint = [Math.max(tree_node.label_size[0] / 2, tree_node.sx.hlength - tree_node.sx.offset[0]) + 1 + tree_node.dx.offset[0], 0]
                    tree_node.offset = [Math.max(tree_node.sx.offset[0], tree_node.label_size[0] / 2), Math.max(tree_node.dx.offset[1], tree_node.label_size[1] / 2)]
                    tree_node.hlength = h1
                    tree_node.vlength = v1
                    break;
                case 1:
                    // caso 2: dx sotto di 1 e sx a destra
                    // sx.rpoint = [dx.h_length - dx.offset.x + 1 + sx.offset.x, 0]
                    // dx.rpoint = [0, tree_node.label_size[1] / 2 + 1 + dx.offset.y]
                    // tree_node.offset.x = Math.max(dx.offset.x, tree_node.label_size[0])
                    // tree_node.offset.y = Math.max(sx.offset.y, tree_node.label_size[1])

                    tree_node.sx.rpoint = [Math.max(tree_node.label_size[0] / 2, tree_node.dx.hlength - tree_node.dx.offset[0]) + 1 + tree_node.sx.offset[0], 0]
                    tree_node.dx.rpoint = [0, tree_node.label_size[1] / 2 + 1 + tree_node.dx.offset[1]]
                    tree_node.offset = [Math.max(tree_node.dx.offset[0], tree_node.label_size[0] / 2), Math.max(tree_node.sx.offset[1], tree_node.label_size[1] / 2)]
                    tree_node.hlength = h2
                    tree_node.vlength = v2
                    break;
                case 2:
                    // caso 3: dx a destra di 1 e sx sotto
                    // sx.rpoint = [0, 1 + dx.v_length - dx.offset.y]
                    // dx.rpoint = [tree_node.label_size[0] / 2 + 1 + dx.offset.x, 0]
                    // tree_node.offset.x = Math.max(sx.offset.x, tree_node.label_size[0])
                    // tree_node.offset.y = Math.max(dx.offset.y, tree_node.label_size[1])

                    tree_node.sx.rpoint = [0, 1 + Math.max(tree_node.label_size[1] / 2, tree_node.dx.vlength - tree_node.dx.offset[1]) + 1 + tree_node.sx.offset[1]]
                    tree_node.dx.rpoint = [tree_node.label_size[0] / 2 + 1 + tree_node.dx.offset[0], 0]
                    tree_node.offset = [Math.max(tree_node.sx.offset[0], tree_node.label_size[0] / 2), Math.max(tree_node.dx.offset[1], tree_node.label_size[1] / 2)]
                    tree_node.hlength = h3
                    tree_node.vlength = v3
                    break;
                case 3:
                    // caso 4: sx a destra di 1 e dx sotto
                    // sx.rpoint = [tree_node.label_size[0] / 2 + 1 + sx.offset.x, 0]
                    // dx.rpoint = [0, 1 + sx.v_length - sx.offset.y]
                    // tree_node.offset.x = Math.max(dx.offset.x, tree_node.label_size[0])
                    // tree_node.offset.y = Math.max(sx.offset.y, tree_node.label_size[1])

                    tree_node.sx.rpoint = [tree_node.label_size[0] / 2 + 1 + tree_node.sx.offset[0], 0]
                    tree_node.dx.rpoint = [0, 1 + Math.max(tree_node.label_size[1] / 2, tree_node.sx.vlength - tree_node.sx.offset[1]) + tree_node.dx.offset[1]]
                    tree_node.offset = [Math.max(tree_node.dx.offset[0], tree_node.label_size[0] / 2), Math.max(tree_node.sx.offset[1], tree_node.label_size[1] / 2)]
                    tree_node.hlength = h4
                    tree_node.vlength = v4
                    break;
            }
        }
    }
} 