import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your e-commerce application from here.</p>
        </div>
      </div>

      <div className="admin-welcome">
        <h2>Welcome, Admin 👋</h2>
        <p>Choose an operation below to manage your store.</p>
      </div>

      <div className="admin-cards">
        <Link to="/admin/products" className="admin-card">
          <div className="admin-card-icon">📦</div>

          <div>
            <h3>Product Management</h3>
            <p>Add, update and manage products in your store.</p>
          </div>

          <span className="card-arrow">→</span>
        </Link>

        <Link to="/admin/inventory" className="admin-card">
          <div className="admin-card-icon">📊</div>

          <div>
            <h3>Inventory Management</h3>
            <p>Monitor product stock and inventory information.</p>
          </div>

          <span className="card-arrow">→</span>
        </Link>

        <Link to="/admin/bulk-upload" className="admin-card">
          <div className="admin-card-icon">📤</div>

          <div>
            <h3>Bulk Product Upload</h3>
            <p>Upload multiple products using an Excel file.</p>
          </div>

          <span className="card-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
