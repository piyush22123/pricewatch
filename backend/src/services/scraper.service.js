const axios = require("axios");
const cheerio = require("cheerio");

const scrapeAmazonProduct = async (url) => {
    try {
        if (!url || !url.startsWith("http")) {
            throw new Error("Invalid URL");
        }

        const { data } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        const $ = cheerio.load(data);

        // ✅ Title
        const title = $("#productTitle").text().trim();

        // ✅ Price (handles multiple cases)
        let priceRaw =
            $(".a-price .a-offscreen").first().text() ||
            $("#priceblock_ourprice").text() ||
            $("#priceblock_dealprice").text();

        if (!priceRaw) {
            throw new Error("Price not found");
        }

        const price = parseInt(
            priceRaw
                .replace(/[^0-9.]/g, "")
                .split(".")[0]
        );

        return { title, price };

    } catch (error) {
        console.log("Scraping error:", error.message);
        return null;
    }
};

module.exports = { scrapeAmazonProduct };