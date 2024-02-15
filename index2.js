const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3001;

app.get("/crawl", async (req, res) => {
  const website = req.query.website;

  if (!website) {
    return res.status(400).send("Required query 'website' missing");
  }

  try {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:false
    });
    const registry = {};
    let queue = [website];
    const maxPagesToCrawl = 40; // Limit of pages to crawl

    while (queue.length > 0 && Object.keys(registry).length < maxPagesToCrawl) {
      const url = queue.shift(); // Dequeue the first URL
      console.log("Current URL:", url);
      const page = await browser.newPage();
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        registry[url] = await page.$eval("*", (el) => el.innerText);

        const hrefs = await page.$$eval("a", (anchorEls) =>
          anchorEls.map((a) => a.href).filter((href) => href.startsWith(website))
        );

        const filteredHrefs = hrefs.filter(
          (href) => href.startsWith(website) && !registry.hasOwnProperty(href)
        );

        queue.push(...new Set(filteredHrefs)); // Enqueue unique new URLs
      } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
      } finally {
        await page.close();
      }
    }

    await browser.close();
    return res.status(200).json(registry);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something broke");
  }
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
