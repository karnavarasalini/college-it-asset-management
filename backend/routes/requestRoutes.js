const express = require("express");

const {
    getRequests,
    getRequestById,
    createRequest,
    confirmRequest,
    cancelRequest,
    approveRequest,
    rejectRequest,
    completeRequest
} = require("../controllers/requestController");

const router = express.Router();

router.get("/", getRequests);

router.get("/:id", getRequestById);

router.post("/", createRequest);

router.put("/:id/confirm", confirmRequest);

router.put("/:id/cancel", cancelRequest);

router.put("/:id/approve", approveRequest);

router.put("/:id/reject", rejectRequest);

router.put("/:id/complete", completeRequest);

module.exports = router;
