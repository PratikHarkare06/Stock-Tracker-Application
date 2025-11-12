from nse_bot import NSEBot
from amc_bot import AMCBot
from indices_bot import IndicesBot
import time

def run_all_bots():
    """Run all RPA bots sequentially"""
    print("Starting all RPA bots...")
    
    # Run NSE Bot
    try:
        nse_bot = NSEBot()
        nse_bot.run()
    except Exception as e:
        print(f"NSE Bot failed: {e}")
    
    # Wait a bit between bots
    time.sleep(2)
    
    # Run AMC Bot
    try:
        amc_bot = AMCBot()
        amc_bot.run()
    except Exception as e:
        print(f"AMC Bot failed: {e}")
    
    # Wait a bit between bots
    time.sleep(2)
    
    # Run Indices Bot
    try:
        indices_bot = IndicesBot()
        indices_bot.run()
    except Exception as e:
        print(f"Indices Bot failed: {e}")
    
    print("All RPA bots completed.")

if __name__ == "__main__":
    run_all_bots()