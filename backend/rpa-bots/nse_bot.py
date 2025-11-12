from base_bot import BaseBot
import time
import random

class NSEBot(BaseBot):
    def __init__(self):
        super().__init__("NSE Stock Information Bot")

    def execute(self):
        """Simulate scraping stock information from NSE"""
        print(f"{self.bot_name}: Simulating stock information update")
        
        # Simulate processing time
        time.sleep(random.uniform(1, 3))
        
        # For demonstration, we'll simulate adding/updating stocks
        self.db.connect()
        
        # Add a new stock
        stock_data = (
            f"s{int(time.time())}",
            "NEWCO",
            "Newly Scraped Co",
            round(random.uniform(100, 1000), 2),
            random.randint(10000, 100000),
            "Technology"
        )
        
        self.db.add_stock(stock_data)
        
        # Update a random existing stock price
        existing_stocks = ["s1", "s2", "s3", "s4", "s5"]
        stock_id = random.choice(existing_stocks)
        new_price = round(random.uniform(100, 2000), 2)
        self.db.update_stock_price(stock_id, new_price)
        
        self.db.disconnect()
        
        print(f"{self.bot_name}: Stock information updated successfully")

if __name__ == "__main__":
    bot = NSEBot()
    bot.run()