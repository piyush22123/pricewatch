const cron = require("node-cron");
const User = require("../models/user.model");
const productModel = require("../models/product.model");
const { scrapeAmazonProduct } = require("./scraper.service");
const { sendEmail } = require("./email.service");

const startCronJob = () => {
    cron.schedule("0 */6 * * *", async () => {
        console.log("⏰ Running price check...");

        const products = await productModel.find();

        for (let product of products) {
            try {
                const scrapedData = await scrapeAmazonProduct(product.productUrl);

                if (!scrapedData) continue;

                const { price } = scrapedData;

                // Update DB
                product.currentPrice = price;
                product.lastChecked = new Date();
                await product.save();

                const user = await User.findById(product.user);
                if (!user) continue;

                // Price check logic
                if (price <= product.targetPrice && !product.notified) {
                    await sendEmail(user.email, product, price);
                    product.notified = true;
                    await product.save();
                } else if (price > product.targetPrice) {
                    product.notified = false;
                    await product.save();
                }

            } catch (err) {
                console.log("Error in cron:", err.message);
            }
        }
    });
};

module.exports = { startCronJob };