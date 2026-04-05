const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (email, product, price) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Price Drop Alert 🔥",
            html: `
                <h2>Price Dropped!</h2>
                <p><b>${product.title}</b></p>
                <p>Current Price: ₹${price}</p>
                <p>Your Target Price: ₹${product.targetPrice}</p>
                <a href="${product.productUrl}">View Product</a>
            `
        });

        console.log("📧 Message sent:", info.response);
    } catch (err) {
        console.error("❌ Mail error:", err);
    }
};

module.exports = { sendEmail };