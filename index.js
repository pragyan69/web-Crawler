const puppeteer = require (`puppeteer`)
const main  = async () =>{
    const browser = await puppeteer.launch({
        headless:false, // this will open the browser for an milli second and then again close it 
        defaultViewport:false
    })
    const page = await browser.newPage()
    // await page.goto('https://pytorch.org/');
await page.goto('https://www.amazon.in/')
    // const classes = await page.$$()

    // for(const Class of classes){


    // }
}

main()