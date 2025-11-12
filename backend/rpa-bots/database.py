import sqlite3
import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

class Database:
    def __init__(self):
        self.connection: Optional[sqlite3.Connection] = None
        self.cursor: Optional[sqlite3.Cursor] = None

    def connect(self):
        try:
            # Connect to SQLite database
            self.connection = sqlite3.connect('../stock-tracker-backend/database.sqlite')
            self.cursor = self.connection.cursor()
            print("Database connection established")
        except Exception as e:
            print(f"Error connecting to database: {e}")

    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Database connection closed")

    def add_stock(self, stock_data):
        if not self.connection or not self.cursor:
            print("Database not connected")
            return
        try:
            insert_query = """
            INSERT INTO stocks (id, symbol, name, price, market_cap, sector)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            self.cursor.execute(insert_query, stock_data)
            self.connection.commit()
            print(f"Stock {stock_data[1]} added successfully")
        except Exception as e:
            print(f"Error adding stock: {e}")
            if self.connection:
                self.connection.rollback()

    def update_stock_price(self, stock_id, new_price):
        if not self.connection or not self.cursor:
            print("Database not connected")
            return
        try:
            update_query = """
            UPDATE stocks SET price = ? WHERE id = ?
            """
            self.cursor.execute(update_query, (new_price, stock_id))
            self.connection.commit()
            print(f"Stock {stock_id} price updated to {new_price}")
        except Exception as e:
            print(f"Error updating stock price: {e}")
            if self.connection:
                self.connection.rollback()

    def add_fund(self, fund_data):
        if not self.connection or not self.cursor:
            print("Database not connected")
            return
        try:
            insert_query = """
            INSERT INTO mutual_funds (id, name, amc, category)
            VALUES (?, ?, ?, ?)
            """
            self.cursor.execute(insert_query, fund_data)
            self.connection.commit()
            print(f"Fund {fund_data[1]} added successfully")
        except Exception as e:
            print(f"Error adding fund: {e}")
            if self.connection:
                self.connection.rollback()

    def add_fund_holding(self, holding_data):
        if not self.connection or not self.cursor:
            print("Database not connected")
            return
        try:
            insert_query = """
            INSERT INTO fund_holdings (fund_id, stock_id, percentage)
            VALUES (?, ?, ?)
            """
            self.cursor.execute(insert_query, holding_data)
            self.connection.commit()
            print(f"Holding for fund {holding_data[0]} added successfully")
        except Exception as e:
            print(f"Error adding fund holding: {e}")
            if self.connection:
                self.connection.rollback()

    def update_index(self, index_id, value, change, percent_change):
        if not self.connection or not self.cursor:
            print("Database not connected")
            return
        try:
            update_query = """
            UPDATE indices SET value = ?, change = ?, percent_change = ? WHERE id = ?
            """
            self.cursor.execute(update_query, (value, change, percent_change, index_id))
            self.connection.commit()
            print(f"Index {index_id} updated successfully")
        except Exception as e:
            print(f"Error updating index: {e}")
            if self.connection:
                self.connection.rollback()

    def add_bot_log(self, log_data):
        if not self.connection or not self.cursor:
            print("Database not connected")
            return
        try:
            insert_query = """
            INSERT INTO bot_logs (id, bot_name, status, execution_time, timestamp, result)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            self.cursor.execute(insert_query, log_data)
            self.connection.commit()
            print(f"Bot log for {log_data[1]} added successfully")
        except Exception as e:
            print(f"Error adding bot log: {e}")
            if self.connection:
                self.connection.rollback()