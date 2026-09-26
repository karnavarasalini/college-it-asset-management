const express = require("express");
const cors = require("cors");

const assetRoutes = require("./routes/assetRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Asset API
app.use("/api/assets", assetRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "College IT Asset Management API is running"
    });
});

module.exports = app;