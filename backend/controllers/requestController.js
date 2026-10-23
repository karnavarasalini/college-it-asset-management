const db = require("../config/db");

const RESERVATION_MINUTES = 10;

// Create a 6-digit reservation PIN
const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Give the next FIFO user a 10-minute reservation window
const promoteNextRequest = async (assetId) => {
    const [rows] = await db.query(`
        SELECT
            r.request_id,
            r.user_id
        FROM requests r
        WHERE r.asset_id = ?
          AND r.status = 'PENDING'
          AND (r.approved_by IS NOT NULL OR NOT EXISTS (SELECT 1 FROM assets a WHERE a.asset_id = r.asset_id AND a.requires_approval = TRUE))
        ORDER BY r.request_date ASC, r.request_id ASC
        LIMIT 1
    `, [assetId]);

    if (rows.length === 0) {
        await db.query(`
            UPDATE assets
            SET status = 'AVAILABLE'
            WHERE asset_id = ?
        `, [assetId]);

        return null;
    }

    const pin = generatePin();

    await db.query(`
        UPDATE requests
        SET
            reservation_pin = ?,
            reserved_at = NOW(),
            reservation_expires_at =
                DATE_ADD(NOW(), INTERVAL ${RESERVATION_MINUTES} MINUTE)
        WHERE request_id = ?
    `, [pin, rows[0].request_id]);

    await db.query(`
        UPDATE assets
        SET status = 'RESERVED'
        WHERE asset_id = ?
    `, [assetId]);

    return rows[0].request_id;
};

// Expire a reservation if its 10-minute window has passed
const expireRequestIfNeeded = async (request) => {
    if (
        request.status !== "PENDING" ||
        !request.reservation_expires_at
    ) {
        return request;
    }

    const expiryTime = new Date(request.reservation_expires_at);

    if (expiryTime <= new Date()) {
        await db.query(`
            UPDATE requests
            SET
                status = 'EXPIRED',
                reservation_pin = NULL,
                reserved_at = NULL,
                reservation_expires_at = NULL
            WHERE request_id = ?
              AND status = 'PENDING'
        `, [request.request_id]);

        await promoteNextRequest(request.asset_id);

        request.status = "EXPIRED";
    }

    return request;
};

// GET /api/requests
exports.getRequests = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                r.*,
                a.asset_code,
                a.asset_name,
                a.asset_type,
                a.status AS asset_status,
                u.name AS user_name,
                u.email AS user_email
            FROM requests r
            JOIN assets a
                ON r.asset_id = a.asset_id
            JOIN users u
                ON r.user_id = u.user_id
            ORDER BY r.request_date ASC, r.request_id ASC
        `);

        for (const request of rows) {
            await expireRequestIfNeeded(request);
        }

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch requests"
        });
    }
};

// GET /api/requests/:id
exports.getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                r.*,
                a.asset_code,
                a.asset_name,
                a.asset_type,
                a.status AS asset_status,
                u.name AS user_name,
                u.email AS user_email
            FROM requests r
            JOIN assets a
                ON r.asset_id = a.asset_id
            JOIN users u
                ON r.user_id = u.user_id
            WHERE r.request_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = await expireRequestIfNeeded(rows[0]);

        res.json(request);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch request"
        });
    }
};

// POST /api/requests
exports.createRequest = async (req, res) => {
    try {
        const {
            asset_id,
            user_id,
            purpose
        } = req.body;

        if (!asset_id || !user_id) {
            return res.status(400).json({
                message: "asset_id and user_id are required"
            });
        }

        const [assetRows] = await db.query(`
            SELECT
                asset_id,
                status,
                is_borrowable,
                requires_approval
            FROM assets
            WHERE asset_id = ?
        `, [asset_id]);

        if (assetRows.length === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        const asset = assetRows[0];

        if (!asset.is_borrowable) {
            return res.status(400).json({
                message: "This asset is not borrowable"
            });
        }

        if (
            asset.status === "UNDER_REPAIR" ||
            asset.status === "RETIRED"
        ) {
            return res.status(400).json({
                message: "This asset cannot be requested"
            });
        }

        // Prevent duplicate active requests by the same user
        const [existingRows] = await db.query(`
            SELECT request_id
            FROM requests
            WHERE asset_id = ?
              AND user_id = ?
              AND status IN ('PENDING', 'CONFIRMED')
            LIMIT 1
        `, [asset_id, user_id]);

        if (existingRows.length > 0) {
            return res.status(409).json({
                message: "You already have an active request for this asset"
            });
        }

        const [result] = await db.query(`
            INSERT INTO requests
            (
                asset_id,
                user_id,
                purpose,
                status
            )
            VALUES (?, ?, ?, 'PENDING')
        `, [
            asset_id,
            user_id,
            purpose || null
        ]);

        const requestId = result.insertId;

        // Restricted asset: request waits for admin approval
        if (asset.requires_approval) {
            return res.status(201).json({
                message: "Request submitted for admin approval",
                request_id: requestId,
                status: "PENDING"
            });
        }

        // Self-service asset is immediately available
        if (asset.status === "AVAILABLE") {
            const pin = generatePin();

            await db.query(`
                UPDATE requests
                SET
                    reservation_pin = ?,
                    reserved_at = NOW(),
                    reservation_expires_at =
                        DATE_ADD(NOW(), INTERVAL ${RESERVATION_MINUTES} MINUTE)
                WHERE request_id = ?
            `, [pin, requestId]);

            await db.query(`
                UPDATE assets
                SET status = 'RESERVED'
                WHERE asset_id = ?
            `, [asset_id]);

            return res.status(201).json({
                message: "Request created. Confirm within 10 minutes.",
                request_id: requestId,
                status: "PENDING",
                reservation_pin: pin
            });
        }

        // RESERVED or IN_USE asset -> FIFO queue
        return res.status(201).json({
            message: "Asset is currently occupied. Request added to FIFO queue.",
            request_id: requestId,
            status: "PENDING"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create request"
        });
    }
};

// PUT /api/requests/:id/confirm
exports.confirmRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reservation_pin } = req.body;

        if (!reservation_pin) {
            return res.status(400).json({
                message: "reservation_pin is required"
            });
        }

        const [rows] = await db.query(`
            SELECT *
            FROM requests
            WHERE request_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = rows[0];

        await expireRequestIfNeeded(request);

        if (request.status === "EXPIRED") {
            return res.status(400).json({
                message: "Reservation has expired"
            });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending requests can be confirmed"
            });
        }

        if (
            !request.reservation_pin ||
            request.reservation_pin !== reservation_pin
        ) {
            return res.status(400).json({
                message: "Invalid reservation PIN"
            });
        }

        await db.query(`
            UPDATE requests
            SET
                status = 'CONFIRMED',
                issued_at = NOW()
            WHERE request_id = ?
        `, [id]);

        await db.query(`
            UPDATE assets
            SET status = 'IN_USE'
            WHERE asset_id = ?
        `, [request.asset_id]);

        res.json({
            message: "Request confirmed successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to confirm request"
        });
    }
};

// PUT /api/requests/:id/cancel
exports.cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT *
            FROM requests
            WHERE request_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = rows[0];

        if (
            !["PENDING", "CONFIRMED"].includes(request.status)
        ) {
            return res.status(400).json({
                message: "This request cannot be cancelled"
            });
        }

        // Confirmed means the asset is already in use.
        // It should be returned/completed rather than cancelled.
        if (request.status === "CONFIRMED") {
            return res.status(400).json({
                message: "Confirmed requests must be completed, not cancelled"
            });
        }

        await db.query(`
            UPDATE requests
            SET
                status = 'CANCELLED',
                reservation_pin = NULL,
                reserved_at = NULL,
                reservation_expires_at = NULL
            WHERE request_id = ?
        `, [id]);

        // If this request had the current reservation,
        // promote the next FIFO user.
        if (request.reservation_expires_at) {
            await promoteNextRequest(request.asset_id);
        }

        res.json({
            message: "Request cancelled successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to cancel request"
        });
    }
};

// PUT /api/requests/:id/approve
exports.approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;

        const [rows] = await db.query(`
            SELECT
                r.*,
                a.status AS asset_status,
                a.requires_approval
            FROM requests r
            JOIN assets a
                ON r.asset_id = a.asset_id
            WHERE r.request_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = rows[0];

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending requests can be approved"
            });
        }

        if (!request.requires_approval) {
            return res.status(400).json({
                message: "This request does not require admin approval"
            });
        }

        await db.query(`
            UPDATE requests
            SET
                approved_by = ?,
                approved_date = NOW()
            WHERE request_id = ?
        `, [
            approved_by || null,
            id
        ]);

        // If asset is currently available, start the 10-minute window.
        if (request.asset_status === "AVAILABLE") {
            const pin = generatePin();

            await db.query(`
                UPDATE requests
                SET
                    reservation_pin = ?,
                    reserved_at = NOW(),
                    reservation_expires_at =
                        DATE_ADD(NOW(), INTERVAL ${RESERVATION_MINUTES} MINUTE)
                WHERE request_id = ?
            `, [pin, id]);

            await db.query(`
                UPDATE assets
                SET status = 'RESERVED'
                WHERE asset_id = ?
            `, [request.asset_id]);

            return res.json({
                message: "Request approved. User must confirm within 10 minutes.",
                reservation_pin: pin
            });
        }

        res.json({
            message: "Request approved and remains in the queue"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to approve request"
        });
    }
};

// PUT /api/requests/:id/reject
exports.rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body;

        const [rows] = await db.query(`
            SELECT *
            FROM requests
            WHERE request_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = rows[0];

        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending requests can be rejected"
            });
        }

        await db.query(`
            UPDATE requests
            SET
                status = 'REJECTED',
                approved_by = ?,
                approved_date = NOW(),
                reservation_pin = NULL,
                reserved_at = NULL,
                reservation_expires_at = NULL
            WHERE request_id = ?
        `, [
            approved_by || null,
            id
        ]);

        // If this request had the active reservation,
        // promote the next FIFO user.
        if (request.reservation_expires_at) {
            await promoteNextRequest(request.asset_id);
        }

        res.json({
            message: "Request rejected successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to reject request"
        });
    }
};

// PUT /api/requests/:id/complete
exports.completeRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT *
            FROM requests
            WHERE request_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        const request = rows[0];

        if (request.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Only confirmed requests can be completed"
            });
        }

        await db.query(`
            UPDATE requests
            SET
                status = 'COMPLETED',
                returned_at = NOW()
            WHERE request_id = ?
        `, [id]);

        await db.query(`
            UPDATE assets
            SET status = 'AVAILABLE'
            WHERE asset_id = ?
        `, [request.asset_id]);

        // Give the next FIFO user the reservation window.
        await promoteNextRequest(request.asset_id);

        res.json({
            message: "Request completed and asset returned successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to complete request"
        });
    }
};
