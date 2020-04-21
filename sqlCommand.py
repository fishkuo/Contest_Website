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


def init_child(file="fake.csv"):
    def read_csv(file: str) -> List[Tuple]:
        df = pd.read_csv(file, encoding="ANSI")

        return [tuple(i) for i in df.values.tolist()]

    global db

    db.create_table("child")
    data = read_csv(file)
    SQL = "INSERT INTO `child` (name, type, city, district, address, longitude, latitude, accommodate) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
    db.insert_value(SQL, data)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")

    db = MySQL()
    init_child()
