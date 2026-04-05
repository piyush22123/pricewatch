require("dotenv").config();
const { sendEmail } = require("./src/services/email.service");

const testProduct = {
    title: "Test Product",
    targetPrice: 1000,
    productUrl: "https://example.com"
};

(async () => {
    try {
        await sendEmail("piyushmalviya2201@gmail.com", testProduct, 900);
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
})();