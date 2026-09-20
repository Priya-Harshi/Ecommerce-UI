import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          🛍️ <strong>E-Commerce</strong>
        </Link>
      </div>

      <div className="navbar-links">
        {user?.role === "Admin" ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/inventory">Inventory</Link>
            <Link to="/admin/bulk-upload">Bulk Upload</Link>
          </>
        ) : (
          <>
            <Link to="/products">Products</Link>
            <Link to="/orders">My Orders</Link>

            <Link to="/cart" className="cart-link">
              🛒 Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </>
        )}

        <span className="welcome-text">Welcome, {user?.name}</span>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
