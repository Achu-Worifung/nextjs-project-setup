import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class ChatbotTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        print("Setting up Chrome WebDriver")
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        service = Service(ChromeDriverManager().install())
        cls.driver = webdriver.Chrome(service=service, options=chrome_options)
        cls.wait = WebDriverWait(cls.driver, 20)
        print("WebDriver ready")

    @classmethod
    def tearDownClass(cls):
        print("Tearing down WebDriver")
        cls.driver.quit()

    def test_greeting_and_response(self):
        print("Starting test: test_greeting_and_response")

        driver = self.driver
        wait = self.wait

        print("Navigating to http://localhost:3000")
        driver.get("http://localhost:3000")

        print("Waiting for chat widget button")
        widget_btn = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//button[contains(., 'Chat with AI Assistant')]")
            )
        )
        print("Clicking chat widget button")
        widget_btn.click()

        print("Waiting for greeting message")
        greeting = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Hello there!')]"))
        )
        print(f"Greeting found: {greeting.text}")
        self.assertIn("Hello there!", greeting.text)

        messages = driver.find_elements(By.CSS_SELECTOR, 'div[class*="break-words"]')
        initial_count = len(messages)
        print(f"Initial message count: {initial_count}")

        print("Finding textarea and sending test question")
        textarea = driver.find_element(
            By.CSS_SELECTOR, 'textarea[placeholder*="Type or speak"]'
        )
        textarea.send_keys("What’s the best hotel in Paris?")
        send_btn = driver.find_element(By.XPATH, "//button[text()='Send']")
        print("Clicking Send button")
        send_btn.click()

        print("Waiting for new assistant reply")
        wait.until(lambda d: len(
            d.find_elements(By.CSS_SELECTOR, 'div[class*="break-words"]')
        ) > initial_count + 1)
        after_count = len(driver.find_elements(By.CSS_SELECTOR, 'div[class*="break-words"]'))
        print(f"Message count after response: {after_count}")
        self.assertGreater(after_count, initial_count)

        print("test_greeting_and_response completed successfully")

if __name__ == "__main__":
    unittest.main(verbosity=2)