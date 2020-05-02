import json
import pandas as pd
import sys


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")

    df = pd.read_csv("csv\\elderlyCareSystem.csv", encoding="ANSI")

    city2district = {i: ["請選擇鄉鎮市區"] for i in df["city"]}
    for city, dist in zip(df["city"], df["district"]):
        if dist not in city2district[city]:
            city2district[city].append(dist)

    district2system = {}
    for city, dist, name in zip(df["city"], df["district"], df["name"]):
        if city not in district2system:
            district2system[city] = {}
        if dist not in district2system[city]:
            district2system[city][dist] = [name]
        else:
            district2system[city][dist].append(name)

    with open("public\\elderCity.json", "w+", encoding="utf-8") as jsonFile:
        json.dump(city2district, jsonFile, indent=4, ensure_ascii=False)

    with open("public\\elderDistrict.json", "w+", encoding="utf-8") as jsonFile:
        json.dump(district2system, jsonFile, indent=4, ensure_ascii=False)

    print("Done")
