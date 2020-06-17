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

