from base_bot import BaseBot
import time
import random

class IndicesBot(BaseBot):
    def __init__(self):
        super().__init__("Indices Data Bot")

    def execute(self):
        """Simulate scraping index information"""
        print(f"{self.bot_name}: Simulating index information update")
        
        # Simulate processing time
        time.sleep(random.uniform(1, 2))
        
        # For demonstration, we'll simulate updating indices
        self.db.connect()
        
        # Update all indices with random changes
        indices = [
            ("idx1", "NIFTY 50"),
            ("idx2", "SENSEX"),
            ("idx3", "NIFTY BANK"),
            ("idx4", "NIFTY IT")
        ]
        
        for index_id, index_name in indices:
            # Generate random changes
            change = round(random.uniform(-100, 100), 2)
            percent_change = round(random.uniform(-2, 2), 2)
            # Get current value from a simulated source
            current_value = round(random.uniform(10000, 80000), 2)
            new_value = round(current_value + change, 2)
            
            self.db.update_index(index_id, new_value, change, percent_change)
        
        self.db.disconnect()
        
        print(f"{self.bot_name}: Index information updated successfully")

if __name__ == "__main__":
    bot = IndicesBot()
    bot.run()