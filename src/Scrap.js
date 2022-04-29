const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="section-directions-trip-0"]/div[1]/div[1]/div[1]/div[2]/div');
  const txt = await el.getProperty('textContent');
  const srcTxt = await txt.jsonValue()

  console.log(Number(srcTxt.match(/\d+/g)));

  browser.close();
}

scrapeProduct('https://www.google.com/maps/dir/44.0101575,-77.997101/43.090823,-76.3212714/@44.4836386,-76.1554808,7z/data=!4m2!4m1!3e0?hl=en');
