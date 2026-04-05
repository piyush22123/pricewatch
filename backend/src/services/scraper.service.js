const puppeteer = require("puppeteer");

const scrapeAmazonProduct = async (page, url) => {
    try {
        if (!url || !url.startsWith("http")) {
            throw new Error("Invalid URL");
        }

        await page.setExtraHTTPHeaders({
            "accept-language": "en-US,en;q=0.9",
        });

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        await page.waitForSelector("#productTitle", { timeout: 15000 });

        const title = await page.$eval("#productTitle", el => el.innerText.trim());

        const priceRaw = await page.$eval(".a-price .a-offscreen", el => el.innerText);

        const price = parseInt(
        priceRaw
            .replace(/[^0-9.]/g, "")  // keep digits + dot
            .split(".")[0]            // remove decimal part
        );

        return { title, price };

    } catch (error) {
        console.log("Scraping error:", error.message);
        return null;
    }
};

module.exports = { scrapeAmazonProduct };