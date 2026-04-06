const cron = require("node-cron");
const puppeteer = require("puppeteer");
const User = require("../models/user.model");
const productModel = require("../models/product.model");
const { scrapeAmazonProduct } = require("./scraper.service");
const { sendEmail } = require("./email.service");

const startCronJob = () => {
    cron.schedule("0 */6 * * * *", async () => {
        console.log("⏰ Running price check...");

        const products = await productModel.find();

        const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--single-process"
        ]
        });


        for (let product of products) {

            const page = await browser.newPage();
            
            try {
                const scrapedData = await scrapeAmazonProduct(page, product.productUrl);

                if (!scrapedData) continue;

                const { price } = scrapedData;

                // Update DB
                product.currentPrice = price;
                product.lastChecked = new Date();
                await product.save();

                // Fetch user
                const user = await User.findById(product.user);

                if (!user) continue;

                // Check condition
                if (price <= product.targetPrice && !product.notified) {
                    await sendEmail(user.email, product, price);
                    product.notified = true;
                    await product.save();
                }
                else if (price > product.targetPrice) {
                    product.notified = false;
                    await product.save();
                }
                else {
                    product.notified = false; // reset
                }

            } catch (err) {
                console.log("Error in cron:", err.message);
            }
            finally {
                await page.close(); //
            }
        }
        await browser.close();
    });
    
};

module.exports = { startCronJob };