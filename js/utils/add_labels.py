import json, random, sys

filename = sys.argv[1]

with open(filename, 'r') as file:
    data = json.load(file)
    
    for n in data['nodes']:
        n['label_size'] = [random.randint(1,5)*2 ,random.randint(1,5)*2]
    
    modified = data

with open(filename, 'w') as file:
        json.dump(modified, file)