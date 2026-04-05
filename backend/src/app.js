const express = require("express");
// const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route.js");


const app = express();
app.use(express.json());
app.use(cors());
// app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("PriceWatch API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;