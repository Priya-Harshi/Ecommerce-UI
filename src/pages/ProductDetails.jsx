import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetails.css";

const API_URL = "https://localhost:7042/api/Product";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product || !product.isActive || product.stockQuantity <= 0) {
      return;
    }

    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingProduct = cart.find((item) => item.productId === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stockQuantity) {
        setMessage("You cannot add more than available stock.");
        return;
      }

      const updatedCart = cart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setMessage(`${product.name} added to cart.`);
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
                {product.stockQuantity > 0
                  ? `${product.stockQuantity} available`
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

          <button
            className="details-add-button"
            disabled={!product.isActive || product.stockQuantity <= 0}
            onClick={addToCart}
          >
            {product.stockQuantity > 0 && product.isActive
              ? "Add to Cart"
              : "Unavailable"}
          </button>

          {message && <p className="details-success">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
