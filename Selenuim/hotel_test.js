const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require("fs");

// helper to wait for visibility, enablement, then focus & clear
async function readyToType(driver, el) {
  await driver.wait(until.elementIsVisible(el), 5000);
  await driver.wait(until.elementIsEnabled(el), 5000);
  await el.click();
  await el.clear();
}

// helper to set a date via JS (bypass readonly / invisibility)
async function setDateViaJS(driver, locator, date) {
  const el = await driver.wait(until.elementLocated(locator), 10000);
  await driver.executeScript('arguments[0].removeAttribute("readonly");', el);
  await driver.executeScript(
    `
      const input = arguments[0];
      const date = arguments[1];
      input.value = date;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    `,
    el,
    date
  );
  return el;
}

// generic count-adjust helper for guests & rooms
async function adjustCount(driver, countSel, incSel, target, label) {
  console.log(`Selecting ${label} → target ${target}`);
  // blur any open overlays (datepicker, dropdown)
  await driver.executeScript('document.activeElement.blur();');

  // locate & scroll the increment button into view
  const incBtn = await driver.wait(until.elementLocated(By.css(incSel)), 5000);
  await driver.executeScript('arguments[0].scrollIntoView(true);', incBtn);

  // helper to read the current count
  async function readCount() {
    const el = await driver.findElement(By.css(countSel));
    let raw = await el.getAttribute('value');
    if (!raw) {
      raw = await driver.executeScript('return arguments[0].textContent', el);
    }
    console.log(`Raw ${label} count: "${raw}"`);
    const m = raw.match(/\d+/);
    if (!m) throw new Error(`Couldn’t parse ${label} count from "${raw}"`);
    return parseInt(m[0], 10);
  }

  // bump until we reach target
  let count = await readCount();
  console.log(`Initial ${label}: ${count}`);
  while (count < target) {
    await driver.executeScript('arguments[0].click()', incBtn);
    await driver.wait(
      async () => (await readCount()) === count + 1,
      5000,
      `Timed out waiting for ${label} to increment from ${count}`
    );
    count++;
    console.log(`Bumped ${label} to: ${count}`);
  }
  console.log(`Final ${label}: ${count}`);
}

(async function hotelTest() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // 1) Load homepage and nav to Hotels
    await driver.get("http://localhost:3000/");
    console.log("Loaded the page successfully");
    await driver.executeScript("window.location.hash = '#HOTELS'");
    await driver.sleep(2000);

    // 2) Click the Hotels nav item
    const hotelsNav = await driver.wait(until.elementLocated(By.id("hotels")), 5000);
    await hotelsNav.click();
    console.log("Navigated to Hotels section");

    // 3) Verify header and screenshot form
    try {
      await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(), 'Find Your Perfect Hotel')]")),
        10000
      );
      console.log("Found hotel search form header");
      const img = await driver.takeScreenshot();
      fs.writeFileSync("hotelsearchform.png", img, "base64");
      console.log("Saved screenshot: hotelsearchform.png");
    } catch {
      console.log("Could not find header, scrolling into view...");
      await driver.executeScript("document.getElementById('hotel-search-page').scrollIntoView()");
      await driver.sleep(2000);
      console.log("Scrolled to hotel search form");
    }

    // 4) Fill destination
    const destInput = await driver.wait(until.elementLocated(By.id("destination")), 10000);
    await destInput.sendKeys("New York, NY");
    console.log("Filled destination: New York, NY");

    // 5) Set check-in & check-out dates
    await setDateViaJS(driver, By.id("checkin"), "2025-10-01");
    console.log("Set checkin date to 2025-10-01");
    await setDateViaJS(driver, By.id("checkout"), "2025-10-10");
    console.log("Set checkout date to 2025-10-10");

    // 6) Select 2 guests
    await adjustCount(
      driver,
      '[data-testid="guests-count"]',
      '[data-testid="guests-increment"]',
      2,
      'guests'
    );

    // 7) Select 2 rooms
    await adjustCount(
      driver,
      '[data-testid="rooms-count"]',
      '[data-testid="rooms-increment"]',
      2,
      'rooms'
    );
// 8) Submit search
    const searchBtn = await driver.findElement(By.id("search-hotels-button"));
    await searchBtn.click();
    console.log("Clicked hotel search button");

// 9) Wait for the results grid, then grab the first card
console.log("Waiting for search results to appear…");
const firstCard = await driver.findElement(By.id("hotel-search"));
await driver.wait(until.elementIsVisible(firstCard), 5000);
console.log("Results:", await firstCard.getText());
console.log("Test Success: Hotel search passed!");
  } catch (err) {
    console.error("Test Failed:", err);
  } finally {
    await driver.quit();
  }
})();