const { Builder, By, until } = require("selenium-webdriver");

(async function formTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/");
    console.log(" Loaded the page successfully");
    // -------------------CHANGING THE URL HASH TO #HOTELS-----------------------------
    await driver.executeScript("window.location.hash = '#HOTELS'");
    await driver.sleep(2000); // Wait for the page to load with the new hash

    // await driver.get("http://localhost:3000/#Vehicles");
    // -------------------------------GETTING THE FORM INPUT ------------------------------------
    // const pickupFromInput = await driver.findElement(By.id("pickup-location"));
    // await pickupFromInput.sendKeys("New York");

    // /clear Wait for the carousel/form to appear
    // await driver.wait(until.elementIsVisible(driver.findElement(By.id("dropoff-location"))), 5000);
    //--------------------------------NAVIGATING TO THE VEHICLE SEARCH FORM-------------------------------
    // 1. Wait for the Hotels element and click it
    await driver.wait(until.elementLocated(By.id("hotels")), 5000);
    const vehicleNav = await driver.findElement(By.id("hotels"));
    await driver.wait(until.elementIsVisible(vehicleNav), 10000);
    await vehicleNav.click();
    console.log(" Navigated to Hotels section");
    
    // 2. Wait for the vehicle search form to be visible after scrolling
    // console.log(" Waiting for vehicle search form to appear...");
    // await driver.sleep(3000); // Give time for scroll animation and form to load
    
    // 3. Try to find the form by its container or header first
    try {
      // Wait for the form container to appear
      await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Book Your Ride')]")), 10000);
      console.log(" Found vehicle search form");
       await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("vehiclesearchform.png", image, "base64");
    });
    } catch (error) {
      console.log(" Could not find vehicle search form header");
      // Try to scroll to Vehicles section manually
      await driver.executeScript("document.getElementById('Vehicles').scrollIntoView();");
      await driver.sleep(2000);
    }
    
    // 4. First fill pickup location
    await driver.wait(until.elementLocated(By.id("pickup-location")), 15000);
    const pickupFromInput = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("pickup-location"))),
      10000
    );
    await pickupFromInput.sendKeys("New York");
    console.log(" Filled pickup location");
    
    // 5. Now fill dropoff location
    await driver.wait(until.elementLocated(By.id("dropoff-location")), 5000);
    const pickupToInput = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("dropoff-location"))),
      5000
    );
    await pickupToInput.sendKeys("Los Angeles");
    console.log(" Filled dropoff location");
    
    // --------------------------FILLING THE FORM------------------------------------
    console.log(" Filling date and vehicle selection fields...");

    await driver.wait(until.elementLocated(By.id("pickup-from pickup-date")), 5000);
    const pickupDateInput = await driver.findElement(By.id("pickup-from pickup-date"));
    await pickupDateInput.sendKeys("2025-10-01T10:00");
    console.log(" Set pickup date");

    await driver.wait(until.elementLocated(By.id("pickup-to")), 5000);
    const returnDateInput = await driver.findElement(By.id("pickup-to"));
    await returnDateInput.sendKeys("2025-10-10T10:00");
    console.log(" Set return date");

    // Select minimum seats (2+)
    await driver.wait(until.elementLocated(By.id("minSeats")), 5000);
    const minSeatsSelect = await driver.findElement(By.id("minSeats"));
    await minSeatsSelect.click();
    const seatsOption = await driver.findElement(
      By.xpath("//option[text()='2+']")
    );
    await seatsOption.click();
    console.log(" Selected minimum seats");
    
    // Select vehicle type (SUV)
    await driver.wait(until.elementLocated(By.id("vehicleType")), 5000);
    const vehicleTypeSelect = await driver.findElement(By.id("vehicleType"));
    await vehicleTypeSelect.click();
    const suvOption = await driver.findElement(
      By.xpath("//option[text()='SUV']")
    );
    await suvOption.click();
    console.log(" Selected vehicle type");

    // --------------------------SUBMITTING THE FORM ------------------------------------
    console.log(" Submitting the search form...");
    const searchButton = await driver.findElement(
      By.id("search-vehicles-button")
    );
    await searchButton.click();
    console.log(" Clicked search button");

    // -------------------------WAIT FOR THE RESULTS TO APPEAR---------------------------
    console.log(" Waiting for search results to appear...");
    const resultElement = await driver.wait(
      until.elementLocated(By.id("car-search-results")),
      10000
    );
    const resultText = await resultElement.getText();
    console.log(" Found search results element");

    // -------------------------VERIFY RESULTS ARE BEING DISPLAYED------------------------
    if (resultText.includes("Car Rental Results") || resultText.includes("Car Search Results")) {
      console.log(" Test Passed: Found search results");
       await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("testpassed-car-rental-result.png", image, "base64");
    });
    } else {
      console.log(" Test Failed: Unexpected output ->", resultText);
      await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("test-failed-car-rental-result.png", image, "base64");
    });
  }

    // --------------------------TAKE A SCREENSHOT------------------------------------
  } catch (err) {
    console.error(" Test Failed:", err);
    await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("failure.png", image, "base64");
    });
  } finally {
    await driver.quit();
  }
})();


