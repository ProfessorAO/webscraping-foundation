import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const natural = require('natural');

  export function tokenize(str) {
    return str.match(/\b\w+\b/g);
  }

  export function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  export async function getInnerTxt(page) {
    return await page.evaluate(() => {
      return JSON.parse(document.querySelector("body").textContent);
    });
  }
  
  export async function closePopupIfExists(page, selector) {
    if (await page.$(selector)){
      console.log('popup');
      await sleep(2000);
      await page.keyboard.press('Escape');

    }else if(await page.$(".recommendation-modal__container")){
      console.log('pop up');
      await page.waitForSelector('.recommendation-modal__container', { visible: true });
      await page.evaluate(() => {
        const container = document.querySelector('.recommendation-modal__button');
        if (container) {
          container.click();
        }
      });
      console.log('clicked');
      await sleep(2000);
      
      
    }else{
      console.log('pop up not in DOM');
    }
    
  }
  
  export function toExcel(data,name){
    try{
        const worksheet = xlsx.utils.json_to_sheet(data);
        // Create a new workbook
        const workbook = xlsx.utils.book_new();

        // Append the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, name);

        // Write the workbook to a file
        xlsx.writeFile(workbook, name+'.xlsx');

    }catch(error){
        console.log("Error Caught while creating excel spreadsheet\nError:"+error.message)
    }
    
  }
  
  export function isMatch(itemTitle, searchTerm, positiveKeywords, negativeKeywords) {
    //const similarity = natural.JaroWinklerDistance(searchTerm, itemTitle,{});
    const similarity = calculateCosineSimilarity(searchTerm, itemTitle);
    if (similarity <= 0.8) {
      return false;
    }
  
    const itemKeywords = tokenize(itemTitle.toLowerCase());
    return positiveKeywords.every((pkw) => itemKeywords.includes(pkw.toLowerCase())) &&
      negativeKeywords.every((nkw) => !itemKeywords.includes(nkw.toLowerCase()));
  }

  
  export async function getProductDetails(jsondata, product, size, keywords) {
    const searchTerm = product.toLowerCase();
    const foundProduct = await getBestMatch_USE_Pjson(jsondata, searchTerm, keywords);
  
    if (foundProduct) {
      const handle = foundProduct['handle'];
  
      const foundVariant = foundProduct["variants"].find(variant => variant.option1 === size);
  
      if (foundVariant) {
        const sizeId = foundVariant.id;
        const price = foundVariant.price;
        return { handle, price};
      } else {
        console.log("Size not found");
        throw { name: 'SizeNotFoundError', message: 'The size has not been found' };
      }
    } else {
      console.log('failed');
      throw { name: 'NoProductFoundError', message: 'The product has not been found' };
    }
  }
  