from json import dumps
from sys import argv, exit


if len(argv) != 2:
    print(f"Usage: {argv[0]} <height>")
    exit(-1)

id_nodes = -1
id_edges = -1
nodes, edges = [], []


def complete_tree(height):

    def ct(height):
        global id_edges, id_nodes
        id_nodes += 1
        #id_nodes += 1
        if height == 0:
            node = {"id": id_nodes, "label": str(id_nodes)}
            nodes.append(node)
            return node
        else:

            node = {"id": id_nodes, "label": str(id_nodes), "sx": ct(
                height - 1), "dx": ct(height - 1)}
            nodes.append(node)
            id_edges += 1
            edge_sx = {"id": id_edges, "label": str(
                id_edges), "source": node["id"], "target": node["sx"]["id"], "order": 0}
            id_edges += 1
            edge_dx = {"id": id_edges, "label": str(
                id_edges), "source": node["id"], "target": node["dx"]["id"], "order": 1}
            edges.append(edge_sx)
            edges.append(edge_dx)
            return node
    ct(height)
    return {"nodes": nodes, "edges": edges}


height = int(argv[1])
json_str = dumps(complete_tree(height))

with open(f"complete_trees_{height}.json", "w") as f:
    f.write(json_str)
