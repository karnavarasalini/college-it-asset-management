const express = require("express");

const {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
} = require("../controllers/assetController");

const router = express.Router();

router.get("/", getAssets);

router.get("/:id", getAssetById);

router.post("/", createAsset);

router.put("/:id", updateAsset);

router.delete("/:id", deleteAsset);

module.exports = router;