import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import EvasionPlugin from 'puppeteer-extra-plugin-stealth';
import * as bot from './bot_functions/bot_init.js'
import * as func from './bot_functions/bot_functions.js'
import fs from 'fs/promises';
import xlsx from 'xlsx';



async function main(){
    console.log("Data Collection started")
        try {
            var data = await navigate('https://example.co.uk');
            console.log("Data retrieved \n Lenght of :"+ length);
            await func.toExcel(data,'Name')
        } catch (error) {
            console.log("Failed:",error.message);
            
        }
    
}



async function navigate(website){
    data = {}
    // init puppeteer plugins to avoid detection
    puppeteer.use(StealthPlugin());
    puppeteer.use(EvasionPlugin());

    // init browser - go to bot_init.js to see the args passed in, change accordingly
    const browser = await bot.initBrowser();

    // init new page with the browser - chromium
    const page = await bot.newPage(browser);

    // if page is waiting for 80 seconds - timeout
    await page.setDefaultNavigationTimeout(80000);

    // go to the website
    await page.goto(website);

    // wait for navigation to happen
    await page.waitForNavigation();

    // implements sleeps - 1000ms = 1 second
    await bot.sleep(1000);

    // MAKE SURE TO USE TRY AND CATCHES
    // code to webscrape website data

    // ..
    // ..
    // ..
    
    // ========================================  key concepts ========================================

    // click the selector on the page
    await page.click('selector');

    // focus on a input to type or select from it 
    await page.focus('input-selector');
    await page.keyboard.type("example text");

    // $eval or evaluate applies functions on the html of the website directly - 

    // this scrolls to a position on the page
    await page.evaluate((scrollPosition) => {
        window.scrollTo(0, scrollPosition);
    }, lastScrollPosition);
    return data;
    // this gets text content from a selector on a page
    const text = await page.$eval('#selector', t => t.textContent);
    data['text'] = text;

    return data;

}


main();