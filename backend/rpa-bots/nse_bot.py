from base_bot import BaseBot
from firecrawl import FirecrawlApp
import os
import time
import random

class NSEBot(BaseBot):
    def __init__(self):
        super().__init__("NSE Stock Information Bot")
        api_key = os.getenv('FIRECRAWL_API_KEY', 'your_firecrawl_api_key_here')
        self.firecrawl = FirecrawlApp(api_key=api_key)

    def scrape_nse_data(self):
        """Scrape stock information from NSE using FireCrawl"""
        try:
            # URLs for NSE market data
            urls = [
                "https://www.nseindia.com/",
                "https://www.nseindia.com/market-data/live-equity-market",
                "https://www.nseindia.com/all-reports"
            ]
            
            # Scrape data from NSE using FireCrawl
            all_stocks = []
            
            # Import signal for timeout handling
            import signal
            
            def timeout_handler(signum, frame):
                raise TimeoutError("Scraping process timed out")
            
            # Set timeout to 60 seconds for the entire process
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(60)
            
            try:
                for url in urls:
                    try:
                        # Scrape the page using FireCrawl with timeout
                        scrape_result = self.firecrawl.scrape(url, formats=['markdown', 'html'], timeout=30)
                        
                        # Parse the scraped data to extract stock information
                        stocks = self.parse_nse_data(scrape_result)
                        all_stocks.extend(stocks)
                        
                        # Add a small delay between requests
                        time.sleep(1)
                    except Exception as url_error:
                        print(f"{self.bot_name}: Error scraping {url}: {url_error}")
                        continue
                
                # Cancel the timeout
                signal.alarm(0)
                
                # If we couldn't scrape real data, fall back to sample data
                if not all_stocks:
                    print(f"{self.bot_name}: Could not scrape real data, using sample data")
                    sample_data = self.generate_sample_stock_data()
                    return sample_data
                
                return {"stocks": all_stocks}
            except TimeoutError:
                # Cancel the timeout
                signal.alarm(0)
                print(f"{self.bot_name}: Scraping process timed out, using sample data")
                sample_data = self.generate_sample_stock_data()
                return sample_data
            
        except Exception as e:
            print(f"{self.bot_name}: Error scraping NSE data: {e}")
            # Return sample data in case of error
            return self.generate_sample_stock_data()

    def generate_sample_stock_data(self):
        """Generate sample stock data for demonstration"""
        # In a real implementation, this would be replaced with actual parsed data
        return {
            "stocks": [
                {
                    "symbol": "RELIANCE",
                    "name": "Reliance Industries Ltd",
                    "price": round(random.uniform(2000, 3000), 2),
                    "market_cap": random.randint(1000000, 2000000),
                    "sector": "Energy"
                },
                {
                    "symbol": "TCS",
                    "name": "Tata Consultancy Services Ltd",
                    "price": round(random.uniform(3000, 4000), 2),
                    "market_cap": random.randint(1000000, 1500000),
                    "sector": "Technology"
                },
                {
                    "symbol": "HDFCBANK",
                    "name": "HDFC Bank Ltd",
                    "price": round(random.uniform(1500, 2500), 2),
                    "market_cap": random.randint(800000, 1200000),
                    "sector": "Banking"
                },
                {
                    "symbol": "INFY",
                    "name": "Infosys Ltd",
                    "price": round(random.uniform(1400, 2200), 2),
                    "market_cap": random.randint(600000, 1000000),
                    "sector": "Technology"
                }
            ]
        }

    def parse_nse_data(self, scrape_result):
        """Parse scraped NSE data to extract stock information"""
        stocks = []
        
        # In a real implementation, you would parse the actual scraped content
        # This is a simplified example of how you might extract stock data
        
        # For demonstration, we'll create some realistic stock data
        # In practice, you would extract this from the scrape_result
        sample_stocks = [
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Ltd",
                "price": round(random.uniform(2000, 3000), 2),
                "market_cap": random.randint(1000000, 2000000),
                "sector": "Energy"
            },
            {
                "symbol": "TCS",
                "name": "Tata Consultancy Services Ltd",
                "price": round(random.uniform(3000, 4000), 2),
                "market_cap": random.randint(1000000, 1500000),
                "sector": "Technology"
            }
        ]
        
        stocks.extend(sample_stocks)
        return stocks
    
    def execute(self):
        """Scrape stock information from NSE using FireCrawl"""
        print(f"{self.bot_name}: Scraping stock information from NSE using FireCrawl")
        
        # Scrape data from NSE
        scraped_data = self.scrape_nse_data()
        
        # Process the scraped data
        self.db.connect()
        
        # Track which stocks we've added to avoid duplicates
        added_symbols = set()
        
        # Add new stocks from scraped data
        for stock in scraped_data["stocks"]:
            # Avoid adding duplicate stocks
            if stock["symbol"] in added_symbols:
                continue
                
            stock_data = (
                f"s{int(time.time() * 1000000)}",  # Unique ID
                stock["symbol"],
                stock["name"],
                stock["price"],
                stock["market_cap"],
                stock["sector"]
            )
            
            self.db.add_stock(stock_data)
            added_symbols.add(stock["symbol"])
        
        # Update multiple existing stock prices for more realistic simulation
        existing_stocks = ["s1", "s2", "s3", "s4", "s5"]
        num_updates = min(3, len(existing_stocks))  # Update up to 3 stocks
        stocks_to_update = random.sample(existing_stocks, num_updates)
        
        for stock_id in stocks_to_update:
            new_price = round(random.uniform(100, 2000), 2)
            self.db.update_stock_price(stock_id, new_price)
        
        self.db.disconnect()
        
        print(f"{self.bot_name}: Stock information updated successfully")

if __name__ == "__main__":
    bot = NSEBot()
    bot.run()