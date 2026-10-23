
import React, { useState } from "react";

const initialForm = {
  asset_code: "",
  asset_name: "",
  asset_type: "LAPTOP",
  brand: "",
  model: "",
  department_id: "",
  location_id: "",
  status: "AVAILABLE",
  is_borrowable: false,
  requires_approval: false,
  purchase_date: "",
};

function AssetForm({ initialData, onSubmit, onCancel, submitting = false }) {
  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    ...(initialData || {}),
    asset_code: initialData?.asset_code || "",
    asset_name: initialData?.asset_name || initialData?.assetName || "",
    asset_type:
      initialData?.asset_type || initialData?.assetType || "LAPTOP",
    brand:
      initialData?.brand ?? initialData?.asset_brand ?? "",
    model:
      initialData?.model ?? initialData?.asset_model ?? "",
    department_id: initialData?.department_id ?? "",
    location_id: initialData?.location_id ?? "",
    purchase_date: initialData?.purchase_date
      ? String(initialData.purchase_date).slice(0, 10)
      : "",
    is_borrowable: Boolean(
      initialData?.is_borrowable ?? initialData?.isBorrowable ?? false
    ),
    requires_approval: Boolean(
      initialData?.requires_approval ?? initialData?.requiresApproval ?? false
    ),
  }));

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit?.({
      ...formData,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      department_id: formData.department_id
        ? Number(formData.department_id)
        : null,
      location_id: formData.location_id
        ? Number(formData.location_id)
        : null,
      purchase_date: formData.purchase_date || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="asset-form">
      <h2>{initialData ? "Edit Asset" : "Add New Asset"}</h2>

      <label>
        Asset Code *
        <input
          name="asset_code"
          value={formData.asset_code}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Asset Name *
        <input
          name="asset_name"
          value={formData.asset_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Asset Type *
        <select
          name="asset_type"
          value={formData.asset_type}
          onChange={handleChange}
          required
        >
          <option value="PC">PC</option>
          <option value="LAPTOP">Laptop</option>
          <option value="PROJECTOR">Projector</option>
          <option value="PRINTER">Printer</option>
        </select>
      </label>

      <label>
        Brand
        <input
          name="brand"
          value={formData.brand ?? ""}
          onChange={handleChange}
        />
      </label>

      <label>
        Model
        <input
          name="model"
          value={formData.model ?? ""}
          onChange={handleChange}
        />
      </label>

      <label>
        Department ID
        <input
          name="department_id"
          type="number"
          min="1"
          value={formData.department_id}
          onChange={handleChange}
        />
      </label>

      <label>
        Location ID
        <input
          name="location_id"
          type="number"
          min="1"
          value={formData.location_id}
          onChange={handleChange}
        />
      </label>

      <label>
        Status
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="IN_USE">In Use</option>
          <option value="UNDER_REPAIR">Under Repair</option>
          <option value="RETIRED">Retired</option>
        </select>
      </label>

      <label>
        Purchase Date
        <input
          name="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={handleChange}
        />
      </label>

      <label>
        <input
          type="checkbox"
          name="is_borrowable"
          checked={formData.is_borrowable}
          onChange={handleChange}
        />
        This asset can be borrowed
      </label>

      <label>
        <input
          type="checkbox"
          name="requires_approval"
          checked={formData.requires_approval}
          onChange={handleChange}
        />
        Admin approval is required
      </label>

      <div className="asset-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Asset"}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AssetForm;
