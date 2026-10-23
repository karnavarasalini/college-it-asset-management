const db = require("../config/db");

// GET /api/assets
exports.getAssets = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                a.*,
                d.department_name,
                l.location_name
            FROM assets a
            LEFT JOIN departments d
                ON a.department_id = d.department_id
            LEFT JOIN locations l
                ON a.location_id = l.location_id
            ORDER BY a.asset_id DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch assets"
        });
    }
};

// GET /api/assets/:id
exports.getAssetById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                a.*,
                d.department_name,
                l.location_name
            FROM assets a
            LEFT JOIN departments d
                ON a.department_id = d.department_id
            LEFT JOIN locations l
                ON a.location_id = l.location_id
            WHERE a.asset_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch asset"
        });
    }
};

// POST /api/assets
exports.createAsset = async (req, res) => {
    try {
        const {
            asset_code,
            asset_name,
            asset_type,
            brand,
            model,
            department_id,
            location_id,
            status,
            is_borrowable,
            requires_approval,
            purchase_date
        } = req.body;

        const [result] = await db.query(`
            INSERT INTO assets
            (
                asset_code,
                asset_name,
                asset_type,
                brand,
                model,
                department_id,
                location_id,
                status,
                is_borrowable,
                requires_approval,
                purchase_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            asset_code,
            asset_name,
            asset_type,
            brand,
            model,
            department_id,
            location_id,
            status || "AVAILABLE",
            is_borrowable || false,
            requires_approval || false,
            purchase_date
        ]);

        res.status(201).json({
            message: "Asset created successfully",
            asset_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create asset"
        });
    }
};

// PUT /api/assets/:id
exports.updateAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            asset_code,
            asset_name,
            asset_type,
            brand,
            model,
            department_id,
            location_id,
            status,
            is_borrowable,
            requires_approval,
            purchase_date
        } = req.body;

        const [result] = await db.query(`
            UPDATE assets
            SET
                asset_code = ?,
                asset_name = ?,
                asset_type = ?,
                brand = ?,
                model = ?,
                department_id = ?,
                location_id = ?,
                status = ?,
                is_borrowable = ?,
                requires_approval = ?,
                purchase_date = ?
            WHERE asset_id = ?
        `, [
            asset_code,
            asset_name,
            asset_type,
            brand,
            model,
            department_id,
            location_id,
            status,
            is_borrowable,
            requires_approval,
            purchase_date,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.json({
            message: "Asset updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update asset"
        });
    }
};

// DELETE /api/assets/:id
exports.deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM assets WHERE asset_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.json({
            message: "Asset deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete asset"
        });
    }
};