// const puppeteer = require('puppeteer');
// // import { createRequire } from 'module';
// // const require = createRequire(import.meta.url);
// // const puppeteer = require('puppeteer');
// // import puppeteer from 'puppeteer';

// async function ScrapeProduct (url) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url);

//   const [el] = await page.$x('//*[@id="section-directions-trip-0"]/div[1]/div[1]/div[1]/div[2]/div');
//   //*[@id="section-directions-trip-1"]/div[1]/div[1]/div[1]/div[2]/div
//   const txt = await el.getProperty('textContent');
//   const srcTxt = await txt.jsonValue()
//   console.log(srcTxt);
//   // console.log(Number(srcTxt.match(/\d+/g)));

//   browser.close();

//   return srcTxt;
// }

// ScrapeProduct('https://www.google.com/maps/dir/43.6511725,-79.3813012/43.2566325,-79.8748934/@43.7535156,-79.417352,9z/data=!4m2!4m1!3e0!5m1!1e1?hl=en');
// // setTimeout(() =>{
// //   console.log('x - ', x);
// // }, 5000)

// // export const getKM = async (url) => {
// // const x = await ScrapeProduct(url);
// // console.log('x - ', x);
// // return x;
// // }

// // getKM('https://www.google.com/maps/dir/43.6511725,-79.3813012/43.2566325,-79.8748934/@43.7535156,-79.417352,9z/data=!4m2!4m1!3e0!5m1!1e1?hl=en')







// // export default ScrapeProduct;