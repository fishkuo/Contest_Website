import json
import sys
from typing import List, Tuple

import mysql.connector
import pandas as pd


class MySQL:
    def __init__(self, file="user.json"):
        try:
            self._connection = mysql.connector.connect(**self.get_account_info(file))
            self.cursor = self._connection.cursor()
            self.tableDict = self.get_table()
            print("Connection success !")

        except:
            print("Connection Error: Check Internet Settings !")

    def __del__(self):
        self._connection.close()

    def head(self, table: str):
        self.cursor.execute(f"SELECT * FROM {table} LIMIT 5")
        for i in self.cursor:
            print(i)

    def print_table(self, table: str):
        self.cursor.execute(f"SELECT * FROM {table}")
        for i in self.cursor:
            print(i)

    def insert_value(self, query: str, value: List[Tuple]):
        self.cursor.executemany(query, value)
        self._connection.commit()
        print("Insert successed !")

    def update_value(self, query: str):
        self.cursor.execute(query)
        self.cursor.commit()
        print("Update successed !")

    def create_table(self, tableName):
        try:
            self.cursor.execute(f"DROP TABLE IF EXISTS {tableName}")
            self.cursor.execute(self.tableDict[tableName])
            print(f"Table {tableName} created !")
        except KeyError:
            print("Failed to create table")

    @staticmethod
    def get_account_info(file: str):
        with open(file, "r") as account:
            user, password = json.load(account).values()

        return {
            "host": "db.cbgo4t4xbjoi.ap-southeast-1.rds.amazonaws.com",
            "user": user,
            "passwd": password,
            "database": "db",
        }

    @staticmethod
    def get_table():
        with open("tableDict.json", "r") as table:
            return json.load(table)


def read_csv(file: str) -> List[Tuple]:
    df = pd.read_csv(file, encoding="ANSI")

    return [tuple(i) for i in df.values.tolist()]


def init_child(file="csv/childCareSystem.csv"):
    global db

    db.create_table("childCareSystem")
    data = read_csv(file)
    SQL = "INSERT INTO `childCareSystem` (name, type, city, district, address, longitude, latitude,\
           capacity, evaluate_year, evaluation_type, evaluation_result, \
           rating_amount, rating_score, rating_average, google_rating)\
           VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    db.insert_value(SQL, data)


def init_child_demand(file="csv/predict_child.csv"):
    global db

    db.create_table("childSystemDemand")
    data = read_csv(file)
    SQL = """INSERT INTO `childSystemDemand` (town, town_id, year_99, year_100, year_101, 
        year_102, year_103, year_104, year_105, year_106, year_107, year_108, year_109, 
        year_110, year_111, year_112, year_113, year_114, year_115, year_116, year_117, year_118) 
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    db.insert_value(SQL, data)


def init_elderly(file="csv/elderlyCareSystem.csv"):
    global db

    db.create_table("elderlyCareSystem")
    data = read_csv(file)
    SQL = "INSERT INTO `elderlyCareSystem` (name, level, type, city, district, address, longitude, latitude)\
           VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
    db.insert_value(SQL, data)


def init_elderly_demand(file="csv/predict_old.csv"):
    global db

    db.create_table("elderlySystemDemand")
    data = read_csv(file)
    SQL = """INSERT INTO `childSystemDemand` (town, town_id, year_99, year_100, year_101, 
        year_102, year_103, year_104, year_105, year_106, year_107, year_108, year_109, 
        year_110, year_111, year_112, year_113, year_114, year_115, year_116, year_117, year_118) 
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    db.insert_value(SQL, data)


def init_powerbi(child="csv/powerbi_child.csv", elderly="csv/powerbi_elderly.csv"):
    global db

    db.create_table("powerbi_child")
    db.create_table("powerbi_elderly")

    childData = read_csv(child)
    elderlyData = read_csv(elderly)

    CHILDSQL = """INSERT INTO `powerbi_child` (county, city, district, town_id, longitude, latitude, year, predict) 
                  VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"""
    ELDERLYSQL = """INSERT INTO `powerbi_elderly` (county, city, district, town_id, longitude, latitude, year, predict) 
                  VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"""

    db.insert_value(CHILDSQL, childData)
    db.insert_value(ELDERLYSQL, elderlyData)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")

    db = MySQL()
    db.create_table("childMessage")
    db.create_table("elderlyMessage")
    init_child()
    # init_elderly()
    # init_child_demand()
    # init_elderly_demand()
    # init_powerbi()
    print("SQL Completed !")
