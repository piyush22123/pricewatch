const productModel = require("../models/product.model.js");
const { scrapeAmazonProduct } = require("../services/scraper.service");

const puppeteer = require("puppeteer");

const addProduct = async (req, res) => {
    try {
        const { productUrl, targetPrice } = req.body;
        const userId = req.user.id;

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        let url = productUrl;

        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        const scrapedData = await scrapeAmazonProduct(page, url);

        await browser.close();

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
            targetPrice,
            user: userId
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
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