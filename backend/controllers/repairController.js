const db = require("../config/db");

// GET /api/repairs
exports.getRepairs = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                r.*,
                a.asset_code,
                a.asset_name,
                a.status AS asset_status,
                u.name AS reported_by_name
            FROM repairs r
            JOIN assets a
                ON r.asset_id = a.asset_id
            JOIN users u
                ON r.reported_by = u.user_id
            ORDER BY r.repair_id DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch repairs"
        });
    }
};

// GET /api/repairs/:id
exports.getRepairById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                r.*,
                a.asset_code,
                a.asset_name,
                a.status AS asset_status,
                u.name AS reported_by_name
            FROM repairs r
            JOIN assets a
                ON r.asset_id = a.asset_id
            JOIN users u
                ON r.reported_by = u.user_id
            WHERE r.repair_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Repair not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch repair"
        });
    }
};

// POST /api/repairs
exports.createRepair = async (req, res) => {
    try {
        const {
            asset_id,
            reported_by,
            issue
        } = req.body;

        if (!asset_id || !reported_by || !issue) {
            return res.status(400).json({
                message: "asset_id, reported_by and issue are required"
            });
        }

        const [assetRows] = await db.query(
            "SELECT asset_id, status FROM assets WHERE asset_id = ?",
            [asset_id]
        );

        if (assetRows.length === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        const [result] = await db.query(`
            INSERT INTO repairs
            (
                asset_id,
                reported_by,
                issue,
                status
            )
            VALUES (?, ?, ?, 'REPORTED')
        `, [
            asset_id,
            reported_by,
            issue
        ]);

        await db.query(`
            UPDATE assets
            SET status = 'UNDER_REPAIR'
            WHERE asset_id = ?
        `, [asset_id]);

        res.status(201).json({
            message: "Repair reported successfully",
            repair_id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create repair"
        });
    }
};

// PUT /api/repairs/:id
exports.updateRepair = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            resolution
        } = req.body;

        const [repairRows] = await db.query(
            "SELECT asset_id FROM repairs WHERE repair_id = ?",
            [id]
        );

        if (repairRows.length === 0) {
            return res.status(404).json({
                message: "Repair not found"
            });
        }

        const assetId = repairRows[0].asset_id;

        if (!["REPORTED", "UNDER_REPAIR", "RESOLVED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid repair status"
            });
        }

        if (status === "RESOLVED") {
            await db.query(`
                UPDATE repairs
                SET
                    status = ?,
                    resolution = ?,
                    resolved_date = NOW()
                WHERE repair_id = ?
            `, [
                status,
                resolution || null,
                id
            ]);

            await db.query(`
                UPDATE assets
                SET status = 'AVAILABLE'
                WHERE asset_id = ?
            `, [assetId]);

        } else {
            await db.query(`
                UPDATE repairs
                SET
                    status = ?,
                    resolution = ?
                WHERE repair_id = ?
            `, [
                status,
                resolution || null,
                id
            ]);

            await db.query(`
                UPDATE assets
                SET status = 'UNDER_REPAIR'
                WHERE asset_id = ?
            `, [assetId]);
        }

        res.json({
            message: "Repair updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update repair"
        });
    }
};
