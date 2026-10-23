
import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading assets...</p>;

  if (error) {
    return <p>Could not load assets: {error}</p>;
  }

  return (
    <section className="assets-page">
      <h2>My Assets</h2>
      <p>Total assets: {assets.length}</p>

      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <div>
          {assets.map((asset) => (
            <article
              key={asset.asset_id ?? asset.id ?? asset.asset_code}
              className="asset-details"
            >
              <h3>
                {asset.asset_name || asset.name || "Unnamed Asset"}
              </h3>
              <p>Asset Code: {asset.asset_code || "N/A"}</p>
              <p>Type: {asset.asset_type || "N/A"}</p>
              <p>Department: {asset.department_name || "N/A"}</p>
              <p>Location: {asset.location_name || "N/A"}</p>
              <p>Status: <StatusBadge status={asset.status} /></p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Assets;
