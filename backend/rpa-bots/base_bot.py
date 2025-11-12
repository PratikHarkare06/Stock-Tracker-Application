import time
import uuid
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from database import Database

class BaseBot:
    def __init__(self, bot_name):
        self.bot_name = bot_name
        self.db = Database()
        self.driver = None

    def setup_driver(self):
        """Setup Chrome WebDriver"""
        try:
            service = Service(ChromeDriverManager().install())
            options = webdriver.ChromeOptions()
            options.add_argument('--headless')  # Run in background
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            self.driver = webdriver.Chrome(service=service, options=options)
            print(f"{self.bot_name}: WebDriver setup completed")
        except Exception as e:
            print(f"{self.bot_name}: Error setting up WebDriver: {e}")

    def close_driver(self):
        """Close WebDriver"""
        if self.driver:
            self.driver.quit()
            print(f"{self.bot_name}: WebDriver closed")

    def log_start(self):
        """Log bot start"""
        log_id = f"log{int(time.time() * 1000000)}"  # Use microseconds for uniqueness
        log_data = (
            log_id,
            self.bot_name,
            'In Progress',
            0.0,
            datetime.now(),
            'Bot started'
        )
        self.db.connect()
        self.db.add_bot_log(log_data)
        self.db.disconnect()
        return log_id

    def log_success(self, log_id, execution_time, result="Bot run completed successfully"):
        """Log bot success"""
        self.db.connect()
        self.db.add_bot_log((
            log_id,
            self.bot_name,
            'Success',
            execution_time,
            datetime.now(),
            result
        ))
        self.db.disconnect()

    def log_failure(self, log_id, execution_time, error_message):
        """Log bot failure"""
        self.db.connect()
        self.db.add_bot_log((
            log_id,
            self.bot_name,
            'Failure',
            execution_time,
            datetime.now(),
            error_message
        ))
        self.db.disconnect()

    def run(self):
        """Main bot execution method"""
        print(f"{self.bot_name}: Starting bot execution")
        
        # Log start
        log_id = self.log_start()
        
        start_time = time.time()
        
        try:
            # Setup
            self.setup_driver()
            
            # Execute bot-specific logic
            self.execute()
            
            # Cleanup
            self.close_driver()
            
            # Log success
            execution_time = round(time.time() - start_time, 2)
            success_log_id = f"log{int(time.time() * 1000000)}"  # Generate new unique ID
            self.log_success(success_log_id, execution_time)
            
            print(f"{self.bot_name}: Bot execution completed successfully in {execution_time} seconds")
            
        except Exception as e:
            # Cleanup
            self.close_driver()
            
            # Log failure
            execution_time = round(time.time() - start_time, 2)
            failure_log_id = f"log{int(time.time() * 1000000)}"  # Generate new unique ID
            self.log_failure(failure_log_id, execution_time, str(e))
            
            print(f"{self.bot_name}: Bot execution failed after {execution_time} seconds: {e}")
            raise e

    def execute(self):
        """Bot-specific execution logic - to be implemented by subclasses"""
        raise NotImplementedError("Execute method must be implemented by subclasses")