
import React from "react";

const STATUS_LABELS = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  IN_USE: "In Use",
  UNDER_REPAIR: "Under Repair",
  RETIRED: "Retired",
};

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toUpperCase();
  const label = STATUS_LABELS[normalizedStatus] || "Unknown";
  const className = STATUS_LABELS[normalizedStatus]
    ? normalizedStatus.toLowerCase().replaceAll("_", "-")
    : "unknown";

  return (
    <span className={`asset-status-badge status-${className}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
