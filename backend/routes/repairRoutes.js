const express = require("express");

const {
    getRepairs,
    getRepairById,
    createRepair,
    updateRepair
} = require("../controllers/repairController");

const router = express.Router();

router.get("/", getRepairs);

router.get("/:id", getRepairById);

router.post("/", createRepair);

router.put("/:id", updateRepair);

module.exports = router;
