import json
import pandas as pd
import sys


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")

    df = pd.read_csv("csv\\childCareSystem.csv", encoding="ANSI")

    data = {i: [] for i in df["district"]}
    district = {i: [] for i in df["city"]}

    for city, dist in zip(df["city"], df["district"]):
        if dist not in district[city]:
            district[city].append(dist)

    for name, dist in zip(df["name"], df["district"]):
        data[dist].append(name)

    with open("public\\city.json", "w+", encoding="utf-8") as jsonFile:
        json.dump(district, jsonFile, ensure_ascii=False)

    with open("public\\district.json", "w+", encoding="utf-8") as jsonFile:
        json.dump(data, jsonFile, ensure_ascii=False)

    print("Done")