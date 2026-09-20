import { useEffect, useState } from "react";
import "./AdminProducts.css";

const API_URL = "https://localhost:7042/api/Product";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load products.");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          isActive: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to add product.");
      }

      setMessage("Product added successfully.");

      clearForm();
      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          isActive: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update product.");
      }

      setMessage("Product updated successfully.");

      clearForm();
      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }

      setMessage("Product deleted successfully.");

      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStockQuantity("");
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStockQuantity(product.stockQuantity);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <h1>Product Management</h1>
          <p>Add, update and manage your store products.</p>
        </div>

        <div className="product-count">{products.length} Products</div>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <div className="product-form-card">
        <div className="form-card-header">
          <div>
            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

            <p>
              {editingId
                ? "Update the product information below."
                : "Enter the details of the new product."}
            </p>
          </div>
        </div>

        <form
          onSubmit={editingId ? handleUpdate : handleAddProduct}
          className="product-form"
        >
          <div className="form-row">
            <div className="form-field">
              <label>Product Name</label>

              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Price</label>

              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Description</label>

            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-field">
            <label>Stock Quantity</label>

            <input
              type="number"
              placeholder="Enter stock quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="products-section">
        <div className="section-header">
          <div>
            <h2>All Products</h2>
            <p>Manage your existing products.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <div>📦</div>
            <h3>No Products Found</h3>
            <p>Add your first product using the form above.</p>
          </div>
        ) : (
          <div className="admin-product-grid">
            {products.map((product) => (
              <div className="admin-product-card" key={product.id}>
                <div className="admin-product-icon">📦</div>

                <div className="admin-product-content">
                  <div className="product-title-row">
                    <h3>{product.name}</h3>

                    <span
                      className={
                        product.isActive
                          ? "status active-status"
                          : "status inactive-status"
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="admin-product-description">
                    {product.description || "No description available."}
                  </p>

                  <div className="product-details">
                    <div>
                      <span>Price</span>
                      <strong>₹{product.price}</strong>
                    </div>

                    <div>
                      <span>Stock</span>
                      <strong>{product.stockQuantity}</strong>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="edit-button"
                      onClick={() => startEditing(product)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
