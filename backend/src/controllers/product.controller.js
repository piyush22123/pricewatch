const productModel = require("../models/product.model.js");
const { scrapeAmazonProduct } = require("../services/scraper.service");


const addProduct = async (req, res) => {
    try {
        const { productUrl, targetPrice } = req.body;
        const userId = req.user.id;

        let url = productUrl;
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        console.log("Scraping URL:", url);

        const scrapedData = await scrapeAmazonProduct(url);

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
            targetPrice: Number(targetPrice),
            user: userId
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (err) {
        console.error("ADD PRODUCT ERROR:", err);
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