const productModel = require("../models/product.model.js");
const { scrapeAmazonProduct } = require("../services/scraper.service");

const puppeteer = require("puppeteer");

const addProduct = async (req, res) => {
    let browser;

    try {
        const { productUrl, targetPrice } = req.body;
        const userId = req.user.id;

        console.log("Starting Puppeteer...");

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        });

        const page = await browser.newPage();

        let url = productUrl;
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        console.log("Opening URL:", url);

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        const scrapedData = await scrapeAmazonProduct(page, url);

        if (!scrapedData) {
            return res.status(400).json({
                message: "Failed to fetch product data"
            });
        }

        const { title, price } = scrapedData;

        const product = await productModel.create({
            productUrl,
            title,
            currentPrice: price,
            targetPrice: Number(targetPrice), // ✅ FIX
            user: userId
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (err) {
        console.error("ADD PRODUCT ERROR:", err); // 🔥 VERY IMPORTANT
        res.status(500).json({ error: err.message });
    } finally {
        if (browser) await browser.close(); // ✅ prevent crash
    }
};


const getProduct = async (req, res) => {
    try {
        const userId = req.user.id;

        const products = await productModel.find({
            user: userId
        });

        res.status(200).json({
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;

        const product = await productModel.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized"
            });
        }

        res.status(200).json({
            message: "Deleted successfully",
            product
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { addProduct, getProduct, deleteProduct }