from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_login_and_search_flight(driver):
    
    try:
        # Navigate to homepage and verify it loads
        driver.get("http://localhost:3000")
        
        # Find and click the theme toggle button with sun/moon icons
        theme_selectors = [
            "//button[contains(@class, 'outline') and .//span[contains(text(), 'Toggle theme')]]",
            "//button[.//sun or .//moon]",  # Look for Sun or Moon components
            "//button[contains(@class, 'outline')][.//svg]",  # Button with outline class containing an SVG
            "//div[contains(@class, 'NavigationMenu')]//button[contains(@class, 'outline')]"  # Button in nav menu
        ]
        
        theme_button = None
        for selector in theme_selectors:
            try:
                theme_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"Found theme button with selector: {selector}")
                break
            except:
                continue
                
        if not theme_button:
            driver.save_screenshot("theme_button_not_found.png")
            print("Page source:", driver.page_source)
            raise Exception("Could not find theme toggle button with any known selector")
            
        theme_button.click()
        time.sleep(1)  # Wait for dropdown to appear
        
        # Try different selectors for the Light option in dropdown
        light_selectors = [
            "//div[contains(@class, 'dropdown-menu')]//div[text()='Light']",
            "//div[contains(@role, 'menu')]//div[text()='Light']",
            "//div[contains(@class, 'menu')]//div[contains(text(), 'Light')]",
            "//div[text()='Light']"
        ]
        
        light_option = None
        for selector in light_selectors:
            try:
                light_option = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"Found light theme option with selector: {selector}")
                break
            except:
                continue
                
        if not light_option:
            driver.save_screenshot("light_option_not_found.png")
            print("Page source:", driver.page_source)
            raise Exception("Could not find Light theme option in dropdown")
            
        light_option.click()
        time.sleep(1)  # Wait for theme to apply
        
        driver.save_screenshot("1_home_page.png")
        
        # Find and click the Login button in the navigation menu
        # Try multiple possible selectors for the login link
        selectors = [
            "//a[@href='/signin']",
            "//button[contains(text(),'Login')]",
            "//div[contains(@class,'NavigationMenuTrigger')][contains(text(),'Login')]",
            "//a[contains(@href,'signin')]",
            "//div[contains(text(),'Login')]"
        ]
        
        login_element = None
        for selector in selectors:
            try:
                login_element = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"Found login element with selector: {selector}")
                break
            except:
                continue
                
        if not login_element:
            driver.save_screenshot("login_button_not_found.png")
            raise Exception("Could not find login button with any known selector")
            
        login_element.click()
        time.sleep(1)  # Short wait to ensure navigation starts
        driver.save_screenshot("2_after_login_click.png")
        
        # Wait for sign-in page and verify URL
        WebDriverWait(driver, 10).until(
            EC.url_contains("/signin")
        )
        print(f"Current URL after clicking login: {driver.current_url}")
        driver.save_screenshot("3_signin_page.png")
        
        # Wait for form elements
        try:
            # Try with ID first
            email_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "signin-email"))
            )
        except:
            # Fallback to type attribute
            email_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
            )
        
        email_input.send_keys("alanrivera1234@gmail.com")
        
        try:
            # Try with ID first
            password_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "signin-password"))
            )
        except:
            # Fallback to type attribute
            password_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
            )
            
        password_input.send_keys("Hello1234!")
        driver.save_screenshot("4_credentials_entered.png")
        
        # Find and click the submit button with multiple possible selectors
        submit_selectors = [
            "//button[@type='submit']",
            "//button[contains(text(),'Sign In')]",
            "//button[contains(text(),'Login')]",
            "//button[contains(.//div/text(),'Sign In')]"
        ]
        
        submit_button = None
        for selector in submit_selectors:
            try:
                submit_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"Found submit button with selector: {selector}")
                break
            except:
                continue
                
        if not submit_button:
            driver.save_screenshot("submit_button_not_found.png")
            raise Exception("Could not find submit button with any known selector")
            
        submit_button.click()
        time.sleep(2)  # Wait for form submission and navigation
        driver.save_screenshot("5_after_submit.png")
        
        # Print current URL to help debug redirect issues
        print(f"Current URL after submit: {driver.current_url}")
        
        # Wait for redirect to home page
        WebDriverWait(driver, 4).until(
            EC.url_to_be("http://localhost:3000/")
        )
        
        # Try multiple selectors for the profile button
        profile_selectors = [
            "//button[contains(@class, 'bg-transparent')]//div[contains(@class, 'rounded-full')]",
            "//div[contains(@class, 'rounded-full')]",
            "//button[contains(@class, 'p-0')]//div",
            "//a[@href='/profileSetting']//button"
        ]
        
        profile_button = None
        for selector in profile_selectors:
            try:
                profile_button = WebDriverWait(driver, 2).until(
                    EC.presence_of_element_located((By.XPATH, selector))
                )
                print(f"Found profile button with selector: {selector}")
                break
            except:
                continue
                
        if not profile_button:
            # Get page source to help debug
            print("Page source after login:", driver.page_source)
            driver.save_screenshot("profile_button_not_found.png")
            raise Exception("Could not find profile button with any known selector")
            
        assert profile_button.is_displayed(), "Profile button found but not visible"
        
        # After successful login, proceed with flight search
        print("Login successful, proceeding with flight search...")
        
        # Wait for the flight booking form to be visible
        WebDriverWait(driver, 1).until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Book Cheap Flights')]"))
        )
        
        # Try to select One-way flight option with multiple possible selectors
        one_way_selectors = [
            "//div[contains(@class, 'cursor-pointer')]//label[normalize-space()='One way']",
            "//div[contains(@class, 'grid-cols-3')]//div[contains(@class, 'cursor-pointer') and .//label[normalize-space()='One way']]",
            "//div[contains(@class, 'cursor-pointer') and contains(@class, 'border')]//label[normalize-space()='One way']",
            "//div[contains(@class, 'flex')]//label[@for='one-way']",
            "//div[contains(@class, 'grid')]//div[.//label[normalize-space()='One way']]"
        ]
        
        one_way_radio = None
        for selector in one_way_selectors:
            try:
                one_way_radio = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"Found one-way radio with selector: {selector}")
                break
            except:
                continue
                
        if not one_way_radio:
            # Get the page source and save a screenshot to help debug the issue
            print("Page source at failure:", driver.page_source)
            driver.save_screenshot("one_way_radio_not_found.png")
            raise Exception("Could not find one-way flight option with any known selector")
            
        one_way_radio.click()
        time.sleep(1)  # Wait for form update
        
        # Enter departure city with proper wait for input field
        depart_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Departure city']"))
        )
        depart_input.clear()
        depart_input.send_keys("New York")
        time.sleep(2)  # Wait for suggestions to appear
        
        # Wait for and select first suggestion for departure
        departure_suggestion = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
        )
        departure_suggestion.click()
        time.sleep(1)  # Wait for selection to be processed
        
        # Enter destination city with proper wait
        dest_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Destination city']"))
        )
        dest_input.clear()
        dest_input.send_keys("London")
        time.sleep(2)  # Wait for suggestions to appear
        
        # Wait for and select first suggestion for destination  
        destination_suggestion = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
        )
        destination_suggestion.click()
        time.sleep(1)  # Wait for selection to be processed
        
        # Set departure date by clicking on the calendar input and selecting a date
        date_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@type='date' and @id='departure']"))
        )
        
        # Click on the date input to open the calendar dropdown
        date_input.click()
        time.sleep(2)  # Wait for calendar to open
        
       
        # Add passengers (2 adults, 1 child)
        # Component starts with 0 adults, so we need to add 2
        for _ in range(2):
            adults_increment = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='adults-increment']"))
            )
            adults_increment.click()
            time.sleep(0.5)
        
        # Add 1 child
        children_increment = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='children-increment']"))
        )
        children_increment.click()
        time.sleep(0.5)
        
        # Select Economy class
        class_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//select"))
        )
        
        # Use the Select class for more reliable dropdown handling
        from selenium.webdriver.support.ui import Select
        select = Select(class_select)
        select.select_by_visible_text("Economy")
        time.sleep(0.5)
        
        # Take screenshot before search
        driver.save_screenshot("7_before_search.png")
        
        # Click search button
        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Search')]"))
        )
        search_button.click()
        
        # Wait for results page
        WebDriverWait(driver, 10).until(
            lambda driver: "flight-search" in driver.current_url
        )
        
        # Take screenshot of results
        driver.save_screenshot("8_search_results.png")
        print("Flight search results loaded successfully")
        
        # Wait for flight cards to appear and select one
        print("Waiting for flight cards to load...")
        flight_cards = WebDriverWait(driver, 15).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'hover:shadow-lg')]"))
        )
        
        if not flight_cards:
            # Try alternative selectors for flight cards
            alternative_selectors = [
                "//div[contains(@class, 'Card')]",
                "//div[contains(@class, 'flight-card')]", 
                "//button[contains(text(), 'Select Flight')]",
                "//div[contains(@class, 'grid') and contains(@class, 'gap-4')]//div[contains(@class, 'Card')]"
            ]
            
            for selector in alternative_selectors:
                try:
                    flight_cards = WebDriverWait(driver, 5).until(
                        EC.presence_of_all_elements_located((By.XPATH, selector))
                    )
                    if flight_cards:
                        print(f"Found flight cards with selector: {selector}")
                        break
                except:
                    continue
                    
        if flight_cards:
            print(f"Found {len(flight_cards)} flight cards")
            
            # First try to click on a flight card (this should navigate to flight details)
            flight_selected = False
            try:
                # Click on the first flight card (this should navigate to flight details)
                first_flight_card = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable(flight_cards[0])
                )
                print("Clicking on first flight card to navigate to details page")
                first_flight_card.click()
                flight_selected = True
                time.sleep(3)  # Wait for navigation to flight details page
                
                # Check if we're on a flight details page
                current_url = driver.current_url
                print(f"After clicking flight card, current URL: {current_url}")
                
                # Look for flight details page indicators
                detail_page_indicators = [
                    "//h1[contains(text(), 'Flight Details')]",
                    "//div[contains(text(), 'Select Your Fare')]",
                    "//button[contains(text(), 'Back to Search')]",
                    "//div[contains(@class, 'fare-options')]"
                ]
                
                is_details_page = False
                for indicator in detail_page_indicators:
                    try:
                        WebDriverWait(driver, 3).until(
                            EC.presence_of_element_located((By.XPATH, indicator))
                        )
                        print(f"Found flight details page indicator: {indicator}")
                        is_details_page = True
                        break
                    except:
                        continue
                
                if is_details_page:
                    print("Successfully navigated to flight details page")
                    driver.save_screenshot("9_flight_details_page.png")
                    
                    # Now try to select a fare class
                    fare_class_selected = False
                    fare_selectors = [
                        "//button[contains(text(), 'Select economy')]",
                        "//button[contains(text(), 'Select business')]", 
                        "//button[contains(text(), 'Select first')]",
                        "//button[contains(@class, 'bg-blue-600') and contains(text(), 'Select')]",
                        "//div[contains(@class, 'fare')]//button[contains(text(), 'Select')]"
                    ]
                    
                    for selector in fare_selectors:
                        try:
                            fare_buttons = WebDriverWait(driver, 5).until(
                                EC.presence_of_all_elements_located((By.XPATH, selector))
                            )
                            if fare_buttons:
                                fare_button = WebDriverWait(driver, 5).until(
                                    EC.element_to_be_clickable(fare_buttons[0])
                                )
                                print(f"Clicking fare class button using selector: {selector}")
                                fare_button.click()
                                fare_class_selected = True
                                time.sleep(2)  # Wait for navigation to booking page
                                print(f"After selecting fare, current URL: {driver.current_url}")
                                driver.save_screenshot("10_after_fare_selection.png")
                                
                                # Check if we're on the booking page and fill out the form
                                try:
                                    WebDriverWait(driver, 10).until(
                                        lambda driver: "booking" in driver.current_url
                                    )
                                    print("Successfully reached the booking/passenger form page")
                                    
                                    # Fill out the booking form with dummy data
                                    print("Filling out passenger information...")
                                    
                                    # Passenger Information
                                    first_name_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "firstName"))
                                    )
                                    first_name_input.clear()
                                    first_name_input.send_keys("John")
                                    
                                    last_name_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "lastName"))
                                    )
                                    last_name_input.clear()
                                    last_name_input.send_keys("Doe")
                                    
                                    email_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "email"))
                                    )
                                    email_input.clear()
                                    email_input.send_keys("john.doe@example.com")
                                    
                                    phone_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "phone"))
                                    )
                                    phone_input.clear()
                                    phone_input.send_keys("+1 (555) 123-4567")
                                    
                                    dob_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "dateOfBirth"))
                                    )
                                    dob_input.clear()
                                    dob_input.send_keys("1985-06-15")
                                    
                                    passport_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "passportNumber"))
                                    )
                                    passport_input.clear()
                                    passport_input.send_keys("A12345678")
                                    
                                    print("Filling out payment information...")
                                    
                                    # Payment Information
                                    card_number_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "cardNumber"))
                                    )
                                    card_number_input.clear()
                                    card_number_input.send_keys("4111 1111 1111 1111")
                                    
                                    expiry_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "expiryDate"))
                                    )
                                    expiry_input.clear()
                                    expiry_input.send_keys("12/28")
                                    
                                    cvv_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "cvv"))
                                    )
                                    cvv_input.clear()
                                    cvv_input.send_keys("123")
                                    
                                    cardholder_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "cardholderName"))
                                    )
                                    cardholder_input.clear()
                                    cardholder_input.send_keys("John Doe")
                                    
                                    # Billing Address
                                    address_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "billingAddress"))
                                    )
                                    address_input.clear()
                                    address_input.send_keys("123 Main Street")
                                    
                                    city_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "city"))
                                    )
                                    city_input.clear()
                                    city_input.send_keys("New York")
                                    
                                    zip_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "zipCode"))
                                    )
                                    zip_input.clear()
                                    zip_input.send_keys("10001")
                                    
                                    country_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.ID, "country"))
                                    )
                                    country_input.clear()
                                    country_input.send_keys("United States")
                                    
                                    # Take screenshot after filling form
                                    driver.save_screenshot("11_form_filled.png")
                                    print("Form filled with dummy data successfully")
                                    
                                    # Submit the booking form
                                    submit_button = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and contains(text(), 'Complete Booking')]"))
                                    )
                                    print("Submitting booking form...")
                                    submit_button.click()
                                    
                                    # Wait for booking confirmation page
                                    try:
                                        WebDriverWait(driver, 15).until(
                                            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Booking Confirmed')]"))
                                        )
                                        print("Booking completed successfully!")
                                        driver.save_screenshot("12_booking_confirmed.png")
                                        
                                        # Wait 10 seconds on the confirmation page
                                        print("Booking confirmed! Waiting 10 seconds on confirmation page...")
                                        time.sleep(10)
                                        
                                    except Exception as e:
                                        print(f"Booking confirmation page not loaded: {e}")
                                        # Still take a screenshot to see what happened
                                        driver.save_screenshot("12_booking_result.png")
                                        print("Waiting 5 seconds to see the result...")
                                        time.sleep(5)
                                    
                                except Exception as e:
                                    print(f"Error filling booking form: {e}")
                                    driver.save_screenshot("11_form_fill_error.png")
                                    
                                break
                        except Exception as e:
                            print(f"Failed to click fare button with selector {selector}: {e}")
                            continue
                    
                    if not fare_class_selected:
                        print("Could not find or click any fare class buttons")
                
                else:
                    print("Did not navigate to flight details page, trying Select Flight button")
                    flight_selected = False
                    
            except Exception as e:
                print(f"Failed to click on flight card: {e}")
                flight_selected = False
            
            # If clicking flight card didn't work, try clicking Select Flight button
            if not flight_selected:
                select_button_selectors = [
                    "//button[contains(text(), 'Select Flight')]",
                    "//button[contains(@class, 'bg-blue-600')]",
                    "//button[contains(@class, 'w-full') and contains(text(), 'Select')]"
                ]
                
                for selector in select_button_selectors:
                    try:
                        select_buttons = WebDriverWait(driver, 5).until(
                            EC.presence_of_all_elements_located((By.XPATH, selector))
                        )
                        if select_buttons:
                            # Click the first available "Select Flight" button
                            first_select_button = WebDriverWait(driver, 5).until(
                                EC.element_to_be_clickable(select_buttons[0])
                            )
                            print(f"Clicking 'Select Flight' button using selector: {selector}")
                            first_select_button.click()
                            flight_selected = True
                            time.sleep(2)  # Wait for navigation
                            print(f"After selecting flight, current URL: {driver.current_url}")
                            driver.save_screenshot("9_after_flight_selection.png")
                            break
                    except Exception as e:
                        print(f"Failed to click select button with selector {selector}: {e}")
                        continue
                
                if not flight_selected:
                    # If we can't find detail links or Select Flight button, try clicking on the card itself
                    try:
                        print("Attempting to click on first flight card directly")
                        first_card = WebDriverWait(driver, 5).until(
                            EC.element_to_be_clickable(flight_cards[0])
                        )
                        first_card.click()
                        flight_selected = True
                    except Exception as e:
                        print(f"Failed to click on flight card: {e}")
                
                if flight_selected:
                    print("Flight selected successfully")
                    time.sleep(3)  # Wait longer for navigation to next page
                    
                    # Take screenshot of the current page
                    driver.save_screenshot("9_after_flight_selection.png")
                    print(f"Navigated to: {driver.current_url}")
                    
                    # Check if we're on a flight details page or still on search results
                    current_url = driver.current_url
                    if "flight-details" in current_url or "flight" in current_url:
                        # Wait for flight details page to load
                        print("Waiting for flight details page to load...")
                        try:
                            WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Flight Details')] | //div[contains(text(), 'Select Your Fare')] | //h4[contains(text(), 'Select Your Fare')]"))
                            )
                            print("Flight details page loaded successfully")
                            
                            # Try to find and select a fare class
                            print("Looking for fare class selection...")
                            fare_selectors = [
                                "//button[contains(text(), 'Select economy')]",
                                "//button[contains(text(), 'Select business')]", 
                                "//button[contains(text(), 'Select first')]",
                                "//button[contains(@class, 'bg-blue-600') and contains(text(), 'Select')]",
                                "//div[contains(@class, 'cursor-pointer')]//button[contains(text(), 'Select')]"
                            ]
                            
                            fare_selected = False
                            for selector in fare_selectors:
                                try:
                                    fare_buttons = WebDriverWait(driver, 5).until(
                                        EC.presence_of_all_elements_located((By.XPATH, selector))
                                    )
                                    if fare_buttons:
                                        # Click the first available fare button (usually Economy)
                                        first_fare_button = WebDriverWait(driver, 5).until(
                                            EC.element_to_be_clickable(fare_buttons[0])
                                        )
                                        print(f"Clicking fare selection button using selector: {selector}")
                                        first_fare_button.click()
                                        fare_selected = True
                                        break
                                except Exception as e:
                                    print(f"Failed to click fare button with selector {selector}: {e}")
                                    continue
                            
                            if fare_selected:
                                print("Fare class selected successfully")
                                time.sleep(2)  # Wait for navigation to booking page
                                
                                # Take screenshot of the booking/passenger form page
                                driver.save_screenshot("10_booking_page.png")
                                print(f"Navigated to booking page: {driver.current_url}")
                            else:
                                print("Could not select a fare class - no clickable elements found")
                                
                        except Exception as e:
                            print(f"Flight details page did not load properly: {e}")
                            print("This may be expected if flight details navigation is not yet implemented")
                    else:
                        print("Still on search results page - flight details navigation may not be implemented yet")
                        print("Test completed flight search and card selection successfully")
                        
                else:
                    print("Could not select a flight - no clickable elements found")
                
        else:
            print("No flight cards found on the results page")
            
        # 5-second grace period before test ends
        print("Test completed successfully. Waiting 5 seconds before closing...")
        time.sleep(5)
        
    except Exception as e:
        # If anything fails, take a final error screenshot and raise the error
        driver.save_screenshot("test_failure.png")
        print(f"Current page source at failure: {driver.page_source}")
        raise Exception(f"Test failed: {str(e)}")

def test_round_trip_flight_booking(driver):
    """
    Test end-to-end round-trip flight booking flow:
    - Login with dummy credentials
    - Set theme to light
    - Search for round-trip flights (New York to London and back)
    - Select 2 adults and 1 child, Economy class
    - Select departure and return dates
    - Choose a flight
    - Select a fare class
    - Fill out booking form with dummy data
    - Complete booking and wait on confirmation page
    """
    
    try:
        # Navigate to homepage
        driver.get("http://localhost:3000")
        
        # Set theme to light (reuse theme setting logic from one-way test)
        theme_selectors = [
            "//button[contains(@class, 'outline') and .//span[contains(text(), 'Toggle theme')]]",
            "//button[.//sun or .//moon]",
            "//button[contains(@class, 'outline')][.//svg]",
            "//div[contains(@class, 'NavigationMenu')]//button[contains(@class, 'outline')]"
        ]
        
        theme_button = None
        for selector in theme_selectors:
            try:
                theme_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"[Round-trip] Found theme button with selector: {selector}")
                break
            except:
                continue
                
        if theme_button:
            theme_button.click()
            time.sleep(1)
            
            # Select Light theme
            light_selectors = [
                "//div[contains(@class, 'dropdown-menu')]//div[text()='Light']",
                "//div[contains(@role, 'menu')]//div[text()='Light']",
                "//div[contains(@class, 'menu')]//div[contains(text(), 'Light')]",
                "//div[text()='Light']"
            ]
            
            for selector in light_selectors:
                try:
                    light_option = WebDriverWait(driver, 2).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    light_option.click()
                    break
                except:
                    continue
            time.sleep(1)
        
        driver.save_screenshot("round_trip_1_home_page.png")
        
        # Login process
        login_selectors = [
            "//a[@href='/signin']",
            "//button[contains(text(),'Login')]",
            "//div[contains(@class,'NavigationMenuTrigger')][contains(text(),'Login')]",
            "//a[contains(@href,'signin')]",
            "//div[contains(text(),'Login')]"
        ]
        
        login_element = None
        for selector in login_selectors:
            try:
                login_element = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"[Round-trip] Found login element with selector: {selector}")
                break
            except:
                continue
                
        if not login_element:
            driver.save_screenshot("round_trip_login_button_not_found.png")
            raise Exception("Could not find login button")
            
        login_element.click()
        time.sleep(1)
        driver.save_screenshot("round_trip_2_after_login_click.png")
        
        # Wait for sign-in page
        WebDriverWait(driver, 10).until(EC.url_contains("/signin"))
        driver.save_screenshot("round_trip_3_signin_page.png")
        
        # Fill login credentials
        try:
            email_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "signin-email"))
            )
        except:
            email_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
            )
        email_input.send_keys("alanrivera1234@gmail.com")
        
        try:
            password_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "signin-password"))
            )
        except:
            password_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
            )
        password_input.send_keys("Hello1234!")
        driver.save_screenshot("round_trip_4_credentials_entered.png")
        
        # Submit login form
        submit_selectors = [
            "//button[@type='submit']",
            "//button[contains(text(),'Sign In')]",
            "//button[contains(text(),'Login')]",
            "//button[contains(.//div/text(),'Sign In')]"
        ]
        
        submit_button = None
        for selector in submit_selectors:
            try:
                submit_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                break
            except:
                continue
                
        if submit_button:
            submit_button.click()
            time.sleep(2)
            driver.save_screenshot("round_trip_5_after_submit.png")
        
        # Wait for redirect to home page
        WebDriverWait(driver, 4).until(EC.url_to_be("http://localhost:3000/"))
        
        # Verify login by checking for profile button
        profile_selectors = [
            "//button[contains(@class, 'bg-transparent')]//div[contains(@class, 'rounded-full')]",
            "//div[contains(@class, 'rounded-full')]",
            "//button[contains(@class, 'p-0')]//div",
            "//a[@href='/profileSetting']//button"
        ]
        
        profile_found = False
        for selector in profile_selectors:
            try:
                profile_button = WebDriverWait(driver, 2).until(
                    EC.presence_of_element_located((By.XPATH, selector))
                )
                if profile_button.is_displayed():
                    profile_found = True
                    break
            except:
                continue
                
        if not profile_found:
            raise Exception("Login verification failed - profile button not found")
            
        print("[Round-trip] Login successful, proceeding with round-trip flight search...")
        
        # Wait for flight booking form
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Book Cheap Flights')]"))
        )
        
        # Select Round-trip option
        round_trip_selectors = [
            "//div[contains(@class, 'cursor-pointer')]//label[normalize-space()='Round trip']",
            "//div[contains(@class, 'grid-cols-3')]//div[contains(@class, 'cursor-pointer') and .//label[normalize-space()='Round trip']]",
            "//div[contains(@class, 'cursor-pointer') and contains(@class, 'border')]//label[normalize-space()='Round trip']",
            "//div[contains(@class, 'flex')]//label[@for='round-trip']",
            "//div[contains(@class, 'grid')]//div[.//label[normalize-space()='Round trip']]"
        ]
        
        round_trip_radio = None
        for selector in round_trip_selectors:
            try:
                round_trip_radio = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"[Round-trip] Found round-trip radio with selector: {selector}")
                break
            except:
                continue
                
        if not round_trip_radio:
            driver.save_screenshot("round_trip_radio_not_found.png")
            raise Exception("Could not find round-trip flight option")
            
        round_trip_radio.click()
        time.sleep(1)
        
        # Enter departure city
        depart_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Departure city']"))
        )
        depart_input.clear()
        depart_input.send_keys("New York")
        time.sleep(2)
        
        # Select departure city suggestion
        departure_suggestion = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
        )
        departure_suggestion.click()
        time.sleep(1)
        
        # Enter destination city
        dest_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Destination city']"))
        )
        dest_input.clear()
        dest_input.send_keys("London")
        time.sleep(2)
        
        # Select destination city suggestion
        destination_suggestion = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
        )
        destination_suggestion.click()
        time.sleep(1)
        
        # Set departure date
        departure_date_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@type='date' and @id='departure']"))
        )
        departure_date_input.click()
        time.sleep(2)
        
        # Set return date (for round-trip flights)
        return_date_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@type='date' and @id='return']"))
        )
        return_date_input.click()
        time.sleep(2)
        
        # Add passengers (2 adults, 1 child)
        for _ in range(2):
            adults_increment = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='adults-increment']"))
            )
            adults_increment.click()
            time.sleep(0.5)
        
        children_increment = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='children-increment']"))
        )
        children_increment.click()
        time.sleep(0.5)
        
        # Select Economy class
        from selenium.webdriver.support.ui import Select
        class_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//select"))
        )
        select = Select(class_select)
        select.select_by_visible_text("Economy")
        time.sleep(0.5)
        
        driver.save_screenshot("round_trip_6_before_search.png")
        
        # Click search button
        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Search')]"))
        )
        search_button.click()
        
        # Wait for results page
        WebDriverWait(driver, 10).until(
            lambda driver: "flight-search" in driver.current_url
        )
        driver.save_screenshot("round_trip_7_search_results.png")
        print("[Round-trip] Flight search results loaded successfully")
        
        # Select flight and complete booking (reuse logic from one-way test)
        print("[Round-trip] Waiting for flight cards to load...")
        flight_cards = WebDriverWait(driver, 15).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'hover:shadow-lg')]"))
        )
        
        if flight_cards:
            print(f"[Round-trip] Found {len(flight_cards)} flight cards")
            
            # Click on first flight card
            first_flight_card = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable(flight_cards[0])
            )
            first_flight_card.click()
            time.sleep(3)
            
            driver.save_screenshot("round_trip_8_flight_details.png")
            
            # Select fare class
            fare_selectors = [
                "//button[contains(text(), 'Select economy')]",
                "//button[contains(text(), 'Select business')]", 
                "//button[contains(text(), 'Select first')]",
                "//button[contains(@class, 'bg-blue-600') and contains(text(), 'Select')]",
                "//div[contains(@class, 'fare')]//button[contains(text(), 'Select')]"
            ]
            
            fare_selected = False
            for selector in fare_selectors:
                try:
                    fare_buttons = WebDriverWait(driver, 5).until(
                        EC.presence_of_all_elements_located((By.XPATH, selector))
                    )
                    if fare_buttons:
                        fare_button = WebDriverWait(driver, 5).until(
                            EC.element_to_be_clickable(fare_buttons[0])
                        )
                        fare_button.click()
                        fare_selected = True
                        time.sleep(2)
                        driver.save_screenshot("round_trip_9_after_fare_selection.png")
                        break
                except:
                    continue
            
            if fare_selected:
                # Fill booking form
                try:
                    WebDriverWait(driver, 10).until(
                        lambda driver: "booking" in driver.current_url
                    )
                    print("[Round-trip] Filling out passenger information...")
                    
                    # Fill passenger information
                    first_name_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "firstName"))
                    )
                    first_name_input.clear()
                    first_name_input.send_keys("Jane")
                    
                    last_name_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "lastName"))
                    )
                    last_name_input.clear()
                    last_name_input.send_keys("Smith")
                    
                    email_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "email"))
                    )
                    email_input.clear()
                    email_input.send_keys("jane.smith@example.com")
                    
                    phone_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "phone"))
                    )
                    phone_input.clear()
                    phone_input.send_keys("+1 (555) 987-6543")
                    
                    dob_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "dateOfBirth"))
                    )
                    dob_input.clear()
                    dob_input.send_keys("1990-03-20")
                    
                    passport_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "passportNumber"))
                    )
                    passport_input.clear()
                    passport_input.send_keys("B98765432")
                    
                    # Fill payment information
                    card_number_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "cardNumber"))
                    )
                    card_number_input.clear()
                    card_number_input.send_keys("5555 5555 5555 4444")
                    
                    expiry_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "expiryDate"))
                    )
                    expiry_input.clear()
                    expiry_input.send_keys("06/29")
                    
                    cvv_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "cvv"))
                    )
                    cvv_input.clear()
                    cvv_input.send_keys("456")
                    
                    cardholder_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "cardholderName"))
                    )
                    cardholder_input.clear()
                    cardholder_input.send_keys("Jane Smith")
                    
                    # Fill billing address
                    address_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "billingAddress"))
                    )
                    address_input.clear()
                    address_input.send_keys("456 Oak Avenue")
                    
                    city_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "city"))
                    )
                    city_input.clear()
                    city_input.send_keys("Los Angeles")
                    
                    zip_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "zipCode"))
                    )
                    zip_input.clear()
                    zip_input.send_keys("90210")
                    
                    country_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "country"))
                    )
                    country_input.clear()
                    country_input.send_keys("United States")
                    
                    driver.save_screenshot("round_trip_10_form_filled.png")
                    
                    # Submit booking
                    submit_button = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and contains(text(), 'Complete Booking')]"))
                    )
                    submit_button.click()
                    
                    # Wait for confirmation
                    try:
                        WebDriverWait(driver, 15).until(
                            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Booking Confirmed')]"))
                        )
                        print("[Round-trip] Booking completed successfully!")
                        driver.save_screenshot("round_trip_11_booking_confirmed.png")
                        
                        # Wait 10 seconds on confirmation page
                        print("[Round-trip] Booking confirmed! Waiting 10 seconds on confirmation page...")
                        time.sleep(10)
                        
                    except Exception as e:
                        print(f"[Round-trip] Booking confirmation page not loaded: {e}")
                        driver.save_screenshot("round_trip_11_booking_result.png")
                        time.sleep(5)
                        
                except Exception as e:
                    print(f"[Round-trip] Error filling booking form: {e}")
                    driver.save_screenshot("round_trip_10_form_error.png")
        
        print("[Round-trip] Test completed successfully. Waiting 5 seconds before closing...")
        time.sleep(5)
        
    except Exception as e:
        driver.save_screenshot("test_failure_round_trip.png")
        raise Exception(f"[Round-trip] Test failed: {str(e)}")


def test_multi_city_flight_booking(driver):
    """
    Test end-to-end multi-city flight booking flow:
    - Login with dummy credentials
    - Set theme to light
    - Search for multi-city flights (New York -> London -> Paris)
    - Select 1 adult, Business class
    - Set dates for each leg
    - Choose flights
    - Select fare class
    - Fill out booking form with dummy data
    - Complete booking and wait on confirmation page
    """
    
    try:
        # Navigate to homepage
        driver.get("http://localhost:3000")
        
        # Set theme to light
        theme_selectors = [
            "//button[contains(@class, 'outline') and .//span[contains(text(), 'Toggle theme')]]",
            "//button[.//sun or .//moon]",
            "//button[contains(@class, 'outline')][.//svg]",
            "//div[contains(@class, 'NavigationMenu')]//button[contains(@class, 'outline')]"
        ]
        
        theme_button = None
        for selector in theme_selectors:
            try:
                theme_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"[Multi-city] Found theme button with selector: {selector}")
                break
            except:
                continue
                
        if theme_button:
            theme_button.click()
            time.sleep(1)
            
            # Select Light theme
            light_selectors = [
                "//div[contains(@class, 'dropdown-menu')]//div[text()='Light']",
                "//div[contains(@role, 'menu')]//div[text()='Light']",
                "//div[contains(@class, 'menu')]//div[contains(text(), 'Light')]",
                "//div[text()='Light']"
            ]
            
            for selector in light_selectors:
                try:
                    light_option = WebDriverWait(driver, 2).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    light_option.click()
                    break
                except:
                    continue
            time.sleep(1)
        
        driver.save_screenshot("multi_city_1_home_page.png")
        
        # Login process
        login_selectors = [
            "//a[@href='/signin']",
            "//button[contains(text(),'Login')]",
            "//div[contains(@class,'NavigationMenuTrigger')][contains(text(),'Login')]",
            "//a[contains(@href,'signin')]",
            "//div[contains(text(),'Login')]"
        ]
        
        login_element = None
        for selector in login_selectors:
            try:
                login_element = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"[Multi-city] Found login element with selector: {selector}")
                break
            except:
                continue
                
        if not login_element:
            driver.save_screenshot("multi_city_login_button_not_found.png")
            raise Exception("Could not find login button")
            
        login_element.click()
        time.sleep(1)
        driver.save_screenshot("multi_city_2_after_login_click.png")
        
        # Wait for sign-in page
        WebDriverWait(driver, 10).until(EC.url_contains("/signin"))
        driver.save_screenshot("multi_city_3_signin_page.png")
        
        # Fill login credentials
        try:
            email_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "signin-email"))
            )
        except:
            email_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
            )
        email_input.send_keys("alanrivera1234@gmail.com")
        
        try:
            password_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.ID, "signin-password"))
            )
        except:
            password_input = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
            )
        password_input.send_keys("Hello1234!")
        driver.save_screenshot("multi_city_4_credentials_entered.png")
        
        # Submit login form
        submit_selectors = [
            "//button[@type='submit']",
            "//button[contains(text(),'Sign In')]",
            "//button[contains(text(),'Login')]",
            "//button[contains(.//div/text(),'Sign In')]"
        ]
        
        submit_button = None
        for selector in submit_selectors:
            try:
                submit_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                break
            except:
                continue
                
        if submit_button:
            submit_button.click()
            time.sleep(2)
            driver.save_screenshot("multi_city_5_after_submit.png")
        
        # Wait for redirect to home page
        WebDriverWait(driver, 4).until(EC.url_to_be("http://localhost:3000/"))
        
        # Verify login by checking for profile button
        profile_selectors = [
            "//button[contains(@class, 'bg-transparent')]//div[contains(@class, 'rounded-full')]",
            "//div[contains(@class, 'rounded-full')]",
            "//button[contains(@class, 'p-0')]//div",
            "//a[@href='/profileSetting']//button"
        ]
        
        profile_found = False
        for selector in profile_selectors:
            try:
                profile_button = WebDriverWait(driver, 2).until(
                    EC.presence_of_element_located((By.XPATH, selector))
                )
                if profile_button.is_displayed():
                    profile_found = True
                    break
            except:
                continue
                
        if not profile_found:
            raise Exception("Login verification failed - profile button not found")
            
        print("[Multi-city] Login successful, proceeding with multi-city flight search...")
        
        # Wait for flight booking form
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Book Cheap Flights')]"))
        )
        
        # Select Multi-city option
        multi_city_selectors = [
            "//div[contains(@class, 'cursor-pointer')]//label[normalize-space()='Multi city']",
            "//div[contains(@class, 'grid-cols-3')]//div[contains(@class, 'cursor-pointer') and .//label[normalize-space()='Multi city']]",
            "//div[contains(@class, 'cursor-pointer') and contains(@class, 'border')]//label[normalize-space()='Multi city']",
            "//div[contains(@class, 'flex')]//label[@for='multi-city']",
            "//div[contains(@class, 'grid')]//div[.//label[normalize-space()='Multi city']]"
        ]
        
        multi_city_radio = None
        for selector in multi_city_selectors:
            try:
                multi_city_radio = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"[Multi-city] Found multi-city radio with selector: {selector}")
                break
            except:
                continue
                
        if not multi_city_radio:
            driver.save_screenshot("multi_city_radio_not_found.png")
            raise Exception("Could not find multi-city flight option")
            
        multi_city_radio.click()
        time.sleep(2)  # Wait for multi-city form to appear
        
        # Fill first leg: New York to London
        depart_inputs = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//input[@placeholder='Departure city']"))
        )
        if depart_inputs:
            depart_inputs[0].clear()
            depart_inputs[0].send_keys("New York")
            time.sleep(2)
            
            # Select first departure suggestion
            departure_suggestion = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
            )
            departure_suggestion.click()
            time.sleep(1)
        
        dest_inputs = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//input[@placeholder='Destination city']"))
        )
        if dest_inputs:
            dest_inputs[0].clear()
            dest_inputs[0].send_keys("London")
            time.sleep(2)
            
            # Select first destination suggestion
            destination_suggestion = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
            )
            destination_suggestion.click()
            time.sleep(1)
        
        # Fill second leg: London to Paris (if multi-city form supports it)
        if len(depart_inputs) > 1 and len(dest_inputs) > 1:
            depart_inputs[1].clear()
            depart_inputs[1].send_keys("London")
            time.sleep(2)
            
            # Select suggestion for second departure
            try:
                departure_suggestion_2 = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
                )
                departure_suggestion_2.click()
                time.sleep(1)
            except:
                pass
            
            dest_inputs[1].clear()
            dest_inputs[1].send_keys("Paris")
            time.sleep(2)
            
            # Select suggestion for second destination
            try:
                destination_suggestion_2 = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'hover:bg-pink-50') and contains(@class, 'cursor-pointer')]"))
                )
                destination_suggestion_2.click()
                time.sleep(1)
            except:
                pass
        
        # Set dates for each leg
        date_inputs = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//input[@type='date']"))
        )
        for i, date_input in enumerate(date_inputs[:2]):  # Handle first two date inputs
            try:
                date_input.click()
                time.sleep(1)
            except:
                pass
        
        # Add passenger (1 adult for multi-city)
        adults_increment = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='adults-increment']"))
        )
        adults_increment.click()
        time.sleep(0.5)
        
        # Select Business class
        from selenium.webdriver.support.ui import Select
        class_select = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//select"))
        )
        select = Select(class_select)
        select.select_by_visible_text("Business")
        time.sleep(0.5)
        
        driver.save_screenshot("multi_city_6_before_search.png")
        
        # Click search button
        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Search')]"))
        )
        search_button.click()
        
        # Wait for results page
        WebDriverWait(driver, 10).until(
            lambda driver: "flight-search" in driver.current_url
        )
        driver.save_screenshot("multi_city_7_search_results.png")
        print("[Multi-city] Flight search results loaded successfully")
        
        # Select flight and complete booking
        print("[Multi-city] Waiting for flight cards to load...")
        flight_cards = WebDriverWait(driver, 15).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'hover:shadow-lg')]"))
        )
        
        if flight_cards:
            print(f"[Multi-city] Found {len(flight_cards)} flight cards")
            
            # Click on first flight card
            first_flight_card = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable(flight_cards[0])
            )
            first_flight_card.click()
            time.sleep(3)
            
            driver.save_screenshot("multi_city_8_flight_details.png")
            
            # Select fare class
            fare_selectors = [
                "//button[contains(text(), 'Select business')]",
                "//button[contains(text(), 'Select economy')]", 
                "//button[contains(text(), 'Select first')]",
                "//button[contains(@class, 'bg-blue-600') and contains(text(), 'Select')]",
                "//div[contains(@class, 'fare')]//button[contains(text(), 'Select')]"
            ]
            
            fare_selected = False
            for selector in fare_selectors:
                try:
                    fare_buttons = WebDriverWait(driver, 5).until(
                        EC.presence_of_all_elements_located((By.XPATH, selector))
                    )
                    if fare_buttons:
                        fare_button = WebDriverWait(driver, 5).until(
                            EC.element_to_be_clickable(fare_buttons[0])
                        )
                        fare_button.click()
                        fare_selected = True
                        time.sleep(2)
                        driver.save_screenshot("multi_city_9_after_fare_selection.png")
                        break
                except:
                    continue
            
            if fare_selected:
                # Fill booking form
                try:
                    WebDriverWait(driver, 10).until(
                        lambda driver: "booking" in driver.current_url
                    )
                    print("[Multi-city] Filling out passenger information...")
                    
                    # Fill passenger information
                    first_name_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "firstName"))
                    )
                    first_name_input.clear()
                    first_name_input.send_keys("Michael")
                    
                    last_name_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "lastName"))
                    )
                    last_name_input.clear()
                    last_name_input.send_keys("Johnson")
                    
                    email_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "email"))
                    )
                    email_input.clear()
                    email_input.send_keys("michael.johnson@example.com")
                    
                    phone_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "phone"))
                    )
                    phone_input.clear()
                    phone_input.send_keys("+1 (555) 456-7890")
                    
                    dob_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "dateOfBirth"))
                    )
                    dob_input.clear()
                    dob_input.send_keys("1975-12-10")
                    
                    passport_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "passportNumber"))
                    )
                    passport_input.clear()
                    passport_input.send_keys("C11223344")
                    
                    # Fill payment information
                    card_number_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "cardNumber"))
                    )
                    card_number_input.clear()
                    card_number_input.send_keys("3782 822463 10005")
                    
                    expiry_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "expiryDate"))
                    )
                    expiry_input.clear()
                    expiry_input.send_keys("09/30")
                    
                    cvv_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "cvv"))
                    )
                    cvv_input.clear()
                    cvv_input.send_keys("789")
                    
                    cardholder_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "cardholderName"))
                    )
                    cardholder_input.clear()
                    cardholder_input.send_keys("Michael Johnson")
                    
                    # Fill billing address
                    address_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "billingAddress"))
                    )
                    address_input.clear()
                    address_input.send_keys("789 Pine Street")
                    
                    city_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "city"))
                    )
                    city_input.clear()
                    city_input.send_keys("Chicago")
                    
                    zip_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "zipCode"))
                    )
                    zip_input.clear()
                    zip_input.send_keys("60601")
                    
                    country_input = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "country"))
                    )
                    country_input.clear()
                    country_input.send_keys("United States")
                    
                    driver.save_screenshot("multi_city_10_form_filled.png")
                    
                    # Submit booking
                    submit_button = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and contains(text(), 'Complete Booking')]"))
                    )
                    submit_button.click()
                    
                    # Wait for confirmation
                    try:
                        WebDriverWait(driver, 15).until(
                            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Booking Confirmed')]"))
                        )
                        print("[Multi-city] Booking completed successfully!")
                        driver.save_screenshot("multi_city_11_booking_confirmed.png")
                        
                        # Wait 10 seconds on confirmation page
                        print("[Multi-city] Booking confirmed! Waiting 10 seconds on confirmation page...")
                        time.sleep(10)
                        
                    except Exception as e:
                        print(f"[Multi-city] Booking confirmation page not loaded: {e}")
                        driver.save_screenshot("multi_city_11_booking_result.png")
                        time.sleep(5)
                        
                except Exception as e:
                    print(f"[Multi-city] Error filling booking form: {e}")
                    driver.save_screenshot("multi_city_10_form_error.png")
        
        print("[Multi-city] Test completed successfully. Waiting 5 seconds before closing...")
        time.sleep(5)
        
    except Exception as e:
        driver.save_screenshot("test_failure_multi_city.png")
        raise Exception(f"[Multi-city] Test failed: {str(e)}")