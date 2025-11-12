from base_bot import BaseBot
import time
import random

class AMCBot(BaseBot):
    def __init__(self):
        super().__init__("AMC Portfolio Disclosure Bot")

    def execute(self):
        """Simulate scraping mutual fund information from AMC websites"""
        print(f"{self.bot_name}: Simulating mutual fund information update")
        
        # Simulate processing time
        time.sleep(random.uniform(2, 5))
        
        # For demonstration, we'll simulate adding funds and holdings
        self.db.connect()
        
        # Add a new fund
        fund_data = (
            f"mf{int(time.time())}",
            "New Vision Growth Fund",
            "New AMC",
            "Flexi Cap"
        )
        self.db.add_fund(fund_data)
        
        # Add holdings for the new fund
        fund_id = fund_data[0]
        holdings = [
            (fund_id, "s1", round(random.uniform(5, 10), 2)),
            (fund_id, "s2", round(random.uniform(5, 10), 2))
        ]
        
        for holding in holdings:
            self.db.add_fund_holding(holding)
        
        self.db.disconnect()
        
        print(f"{self.bot_name}: Mutual fund information updated successfully")

if __name__ == "__main__":
    bot = AMCBot()
    bot.run()