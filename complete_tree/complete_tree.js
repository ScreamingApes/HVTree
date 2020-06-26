function random_int(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function complete_tree(height) {
    let id_nodes = -1;
    let id_edges = -1;
    let nodes = []
    let edges = []
    function ct(height) {
        id_nodes++
        let node
        if (height === 0) {
            node = { id: id_nodes, label: String(id_nodes), label_size: [random_int(1,5) * 2, random_int(1,5) * 2] }
            //node = { id: id_nodes, label: String(id_nodes), label_size: [4, 8] }
            nodes.push(node)
        } else {
            node = { id: id_nodes, label: String(id_nodes), sx: ct(height - 1), dx: ct(height - 1) , label_size: [random_int(1,5) * 2, random_int(1,5) * 2] }
            //node = { id: id_nodes, label: String(id_nodes), sx: ct(height - 1), dx: ct(height - 1) , label_size: [8, 4] }
            nodes.push(node)
            id_edges++
            edge_sx = { id: id_edges, label: String(id_edges), source: node.id, target: node.sx.id, order: 0 }
            edges.push(edge_sx)
            id_edges++
            edge_dx = { id: id_edges, label: String(id_edges), source: node.id, target: node.dx.id, order: 1 }
            edges.push(edge_dx)
        }
        return node
    }
    ct(height)
    return { nodes: nodes, edges: edges }
}