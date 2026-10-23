
import React from "react";
import StatusBadge from "../components/StatusBadge.jsx";

function AssetDetails({ asset, onBack, onEdit }) {
  if (!asset) {
    return (
      <section className="asset-details">
        <p>Asset details are not available.</p>
        {onBack && (
          <button type="button" onClick={onBack}>
            Back to Assets
          </button>
        )}
      </section>
    );
  }

  const assetName = asset.asset_name || asset.assetName || asset.name || "Unnamed Asset";
  const assetId = asset.asset_id ?? asset.assetId ?? asset.id ?? "N/A";
  const department =
  asset.department_name || asset.department?.name || asset.department || "Not specified";

const location =
  asset.location_name || asset.location?.name || asset.location || "Not specified";
  const isBorrowable = asset.is_borrowable ?? asset.isBorrowable ?? false;
  const requiresApproval = asset.requires_approval ?? asset.requiresApproval ?? false;

  return (
    <section className="asset-details">
      <div className="asset-details-header">
        <div>
          <h2>{assetName}</h2>
          <p>Asset ID: {assetId}</p>
        </div>

        <StatusBadge status={asset.status} />
      </div>

      <dl>
        <dt>Asset Type</dt>
        <dd>{asset.asset_type || asset.assetType || asset.type || "Not specified"}</dd>

        <dt>Department</dt>
        <dd>{typeof department === "object" ? department.name || "Not specified" : department}</dd>

        <dt>Location</dt>
        <dd>{typeof location === "object" ? location.name || "Not specified" : location}</dd>

        <dt>Borrowable</dt>
        <dd>{isBorrowable ? "Yes" : "No"}</dd>

        <dt>Approval Required</dt>
        <dd>{requiresApproval ? "Yes" : "No"}</dd>
      </dl>

      <div className="asset-details-actions">
        {onBack && (
          <button type="button" onClick={onBack}>
            Back to Assets
          </button>
        )}

        {onEdit && (
          <button type="button" onClick={() => onEdit(asset)}>
            Edit Asset
          </button>
        )}
      </div>
    </section>
  );
}

export default AssetDetails;
