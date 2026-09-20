import { useState } from "react";
import "./Inventory.css";

const API_URL = "https://localhost:7042/api/Inventory";

function Inventory() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [inventory, setInventory] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const getInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Inventory not found.");
      }

      const data = await response.json();

      setInventory(data);
      setMessage("");
    } catch (error) {
      setInventory(null);
      setMessage(error.message);
    }
  };

  const createInventory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(productId),
          quantity: Number(quantity),
        }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to create inventory.");
      }

      setMessage("Inventory created successfully.");
      setQuantity("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateInventory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(Number(quantity)),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to update inventory.");
      }

      setMessage("Inventory updated successfully.");
      setQuantity("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Manage and monitor product stock.</p>
        </div>
      </div>

      {message && <div className="inventory-message">{message}</div>}

      {/* Search Inventory */}

      <div className="inventory-card">
        <div className="inventory-card-header">
          <div className="inventory-icon">🔎</div>

          <div>
            <h2>Find Inventory</h2>
            <p>Enter a product ID to view its stock.</p>
          </div>
        </div>

        <div className="inventory-search">
          <div className="inventory-field">
            <label>Product ID</label>

            <input
              type="number"
              placeholder="Enter product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <button className="primary-button" onClick={getInventory}>
            Get Inventory
          </button>
        </div>
      </div>

      {/* Create / Update */}

      <div className="inventory-actions">
        <div className="inventory-card">
          <div className="inventory-card-header">
            <div className="inventory-icon">➕</div>

            <div>
              <h2>Create Inventory</h2>
              <p>Create stock information for a product.</p>
            </div>
          </div>

          <form onSubmit={createInventory}>
            <div className="inventory-field">
              <label>Quantity</label>

              <input
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-button full-button">
              Create Inventory
            </button>
          </form>
        </div>

        <div className="inventory-card">
          <div className="inventory-card-header">
            <div className="inventory-icon">✏️</div>

            <div>
              <h2>Update Inventory</h2>
              <p>Change the current stock quantity.</p>
            </div>
          </div>

          <form onSubmit={updateInventory}>
            <div className="inventory-field">
              <label>New Quantity</label>

              <input
                type="number"
                min="0"
                placeholder="Enter new quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-button full-button">
              Update Inventory
            </button>
          </form>
        </div>
      </div>

      {/* Inventory Details */}

      {inventory && (
        <div className="inventory-details">
          <div className="details-header">
            <div>
              <h2>Inventory Details</h2>
              <p>Current stock information.</p>
            </div>

            <span className="inventory-status">Available</span>
          </div>

          <div className="details-grid">
            <div className="detail-box">
              <span>Product ID</span>
              <strong>{inventory.productId}</strong>
            </div>

            <div className="detail-box">
              <span>Current Quantity</span>
              <strong>{inventory.quantity}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
