import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await apiRequest("/assets");
        const list = Array.isArray(data)
          ? data
          : data?.assets || data?.data || [];

        setAssets(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.message || "Unable to load assets.");
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      asset.asset_name,
      asset.name,
      asset.asset_code,
      asset.asset_type,
      asset.department_name,
      asset.location_name,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const matchesStatus =
      statusFilter === "ALL" ||
      String(asset.status || "").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <p>Loading assets...</p>;

  if (error) {
    return <p>Could not load assets: {error}</p>;
  }

  return (
    <section className="assets-page">
      <h2>Assets</h2>
      <p>Total assets: {assets.length}</p>

      <div className="asset-filters">
        <label>
          Search assets
          <input
            type="text"
            placeholder="Search name, code, type, department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Filter by status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="IN_USE">In Use</option>
            <option value="UNDER_REPAIR">Under Repair</option>
            <option value="RETIRED">Retired</option>
          </select>
        </label>
      </div>

      <p>Showing {filteredAssets.length} asset(s)</p>

      {filteredAssets.length === 0 ? (
        <p>No matching assets found.</p>
      ) : (
        <div>
          {filteredAssets.map((asset) => (
            <article
              key={asset.asset_id ?? asset.id ?? asset.asset_code}
              className="asset-details"
            >
              <h3>{asset.asset_name || asset.name || "Unnamed Asset"}</h3>
              <p>Asset Code: {asset.asset_code || "N/A"}</p>
              <p>Type: {asset.asset_type || "N/A"}</p>
              <p>Department: {asset.department_name || "N/A"}</p>
              <p>Location: {asset.location_name || "N/A"}</p>
              <p>
                Status: <StatusBadge status={asset.status} />
              </p>
              <p>
                Borrowable:{" "}
                {Boolean(asset.is_borrowable ?? asset.isBorrowable)
                  ? "Yes"
                  : "No"}
              </p>
              <p>
                Approval Required:{" "}
                {Boolean(
                  asset.requires_approval ?? asset.requiresApproval
                )
                  ? "Yes"
                  : "No"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Assets;