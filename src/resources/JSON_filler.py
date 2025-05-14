import random
import json

with open("resources/graph.json", "r", encoding="utf-8") as f:
    data = json.load(f)

keys = list(data.keys())
graph = {}

for k in keys:
    graph[k] = random.sample([x for x in keys if x != k], random.randint(1, 15))

for node, connection in graph.items():
    print(f'"{node}": {str(connection).replace("'", '"')},')

with open("resources/filled-graph.json", "w", encoding="utf-8") as f:
    json.dump(graph, f, indent=2)
