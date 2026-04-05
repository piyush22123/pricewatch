const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
    productUrl: {
        type: String,
        required: true
    },
    title: String,
    currentPrice: Number,
    targetPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastChecked: {
        type: Date,
        default: Date.now
    },
    notified: { // falg to avoid sending email every time cron run 
        type: Boolean,
        default: false
    }
    }, 
    { timestamps: true }
);


const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;