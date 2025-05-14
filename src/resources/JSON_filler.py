import pandas
import json

df : pandas.DataFrame = pandas.read_csv("src/resources/adyacencia.csv", sep=';', header=0)
print(list(df.columns))

index_not_zero = [ list(df[df[name] != 0].index) for name in list(df.columns)]
print("\n".join([ str(e) +"," for e in index_not_zero]))


with open("src/resources/adjacency.json", "w", encoding="UTF-8") as f:
    json.dump(index_not_zero , f, ensure_ascii=False, indent=2)
