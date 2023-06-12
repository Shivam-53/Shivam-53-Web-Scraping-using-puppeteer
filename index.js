require("dotenv").config();
const { error } = require('console');
const puppeteer = require('puppeteer');

async function scrapeEmail(email) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://haveibeenpwned.com');

    await page.type('#Account', email);

    await Promise.all([
      page.waitForNavigation(),
      page.click('#searchPwnage'),
    ]);

    const newcount = await page.evaluate(() => {
      const pwnCount = document.querySelector("#pwnCount").innerText;
      return pwnCount;
    });

    if (newcount.length === 91) {
      console.log("Congratulations! Not Pawned");
    } else {
      console.log("Oh no, this email is pawned");
      const pawnedSites = await page.evaluate(() => {
        const sites = Array.from(document.querySelectorAll(".pwnedCompanyTitle"), element => element.innerText);
        return sites;
      });

      console.log(pawnedSites);

    }
    await browser.close();

  } catch (error) {
    console.error('Error:', error);
    return 'An error occurred while scraping the email.';
  }
}

scrapeEmail(process.env.email).then(result => {
  // console.log(result);
});
