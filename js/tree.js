var nodeTree = []
var mapNodes = d3.map({})

d3.json("data/input.json")
        .then(function(tree){
            tree.nodes.forEach(element => {
                let node = {}
                node.id = element.id
                
                mapNodes.set(node.id, node)
                nodeTree.push(node)
            });
            
            tree.edges.forEach(element =>{
                let source = mapNodes.get(element.source)
                let target = mapNodes.get(element.target)
                
                if (element.order == 0){
                    source.sx = target
                }else{
                    source.dx = target
                }
            })
        })

is_leaf(tree_node) = tree_node.sx === null && tree_node.dxx === null
sum_point(point1, point2) = [point1[0] + point2[0], point1[1] + point2[1]]

function size_subtrees(tree_node) {
    if (tree_node === null) {
        return 0;
    } else {
        tree_node.size_dx = size_subtrees(tree_node.dx)
        tree_node.size_sx = size_subtrees(tree_node.sx)
        return tree_node.size_dx + tree_node.size_sx + 1
    }
}

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
