import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetails.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7000";
const API_URL = `${BASE_URL}/api/Product`;

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartQty, setCartQty] = useState(0);

  const refreshCartQty = (productId) => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const item = cart.find((c) => c.productId === Number(productId));
    setCartQty(item ? item.quantity : 0);
  };

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Product not found.");
      }

      const data = await response.json();
      setProduct(data);
      refreshCartQty(data.id);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addOrUpdateCart = (newQty) => {
    if (!product) return;

    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existing = cart.find((item) => item.productId === product.id);

    let updatedCart;
    if (!existing && newQty > 0) {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: newQty,
        },
      ];
    } else {
      updatedCart = cart
        .map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item,
        )
        .filter((item) => item.quantity > 0);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartQty(newQty);
  };

  const increaseQty = () => {
    if (!product) return;

    if (cartQty >= product.stockQuantity) {
      setMessage("You cannot add more than available stock.");
      return;
    }

    addOrUpdateCart(cartQty + 1);
    setMessage(`${product.name} added to cart.`);
  };

  const decreaseQty = () => {
    if (cartQty <= 0) return;
    addOrUpdateCart(cartQty - 1);
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <p className="details-message">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>{message || "The requested product does not exist."}</p>
          <Link to="/products" className="back-products-button">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const availableNow = Math.max(product.stockQuantity - cartQty, 0);

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-products">
        ← Back to Products
      </Link>

      <div className="product-details-card">
        <div className="product-details-image">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="details-placeholder">🛍️</div>
          )}
        </div>

        <div className="product-details-content">
          <p className="details-label">PRODUCT</p>
          <h1>{product.name}</h1>

          <p className="details-description">
            {product.description || "No description available."}
          </p>

          <div className="details-price">₹{product.price}</div>

          <div className="details-info">
            <div>
              <span>Stock</span>
              <strong>
                {availableNow > 0
                  ? `${availableNow} available`
                  : "Out of stock"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong
                className={
                  product.isActive ? "details-active" : "details-inactive"
                }
              >
                {product.isActive ? "Available" : "Inactive"}
              </strong>
            </div>
          </div>

          {!product.isActive || product.stockQuantity <= 0 ? (
            <button className="details-add-button" disabled>
              Unavailable
            </button>
          ) : cartQty === 0 ? (
            <button className="details-add-button" onClick={increaseQty}>
              Add to Cart
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="details-add-button" onClick={decreaseQty}>
                -
              </button>
              <strong>{cartQty}</strong>
              <button
                className="details-add-button"
                onClick={increaseQty}
                disabled={cartQty >= product.stockQuantity}
              >
                +
              </button>
            </div>
          )}

          {message && <p className="details-success">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
