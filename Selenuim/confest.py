import platform
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType

@pytest.fixture(scope="session")
def driver():
    # Setup Chrome options
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--start-maximized')  # Start with maximized window
    
    # Check if running on Mac ARM
    if platform.system() == 'Darwin' and platform.machine() == 'arm64':
        chrome_options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    
    # Initialize the Chrome WebDriver with appropriate driver for the platform
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)  # Set implicit wait time
    
    yield driver
    
    # Cleanup after tests
    driver.quit()
