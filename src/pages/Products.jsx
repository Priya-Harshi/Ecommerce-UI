import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Products.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7000";
const API_URL = `${BASE_URL}/api/Product`;

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, []);

  useEffect(() => {
    fetchProducts();

    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);

    const intervalId = setInterval(fetchProducts, 5000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(intervalId);
    };
  }, [fetchProducts]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const getCartQty = (productId) => {
    const item = cart.find((c) => c.productId === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
    const currentQty = getCartQty(product.id);

    if (currentQty >= product.stockQuantity) {
      setMessage("You cannot add more than available stock.");
      return;
    }

    if (currentQty === 0) {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    }

    setMessage(`${product.name} added to cart.`);
  };

  const increaseQty = (product) => {
    const currentQty = getCartQty(product.id);

    if (currentQty >= product.stockQuantity) {
      setMessage("You cannot add more than available stock.");
      return;
    }

    setCart(
      cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQty = (product) => {
    const currentQty = getCartQty(product.id);
    if (currentQty <= 0) return;

    const updated = cart
      .map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Our Products</h1>
          <p>Find the products you love.</p>
        </div>

        <Link to="/cart" className="cart-button">
          🛒 Cart ({cartCount})
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {message && <div className="message">{message}</div>}

      {products.length === 0 && !message && (
        <p className="empty-message">No products available.</p>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => {
          const cartQty = getCartQty(product.id);
          const availableNow = Math.max(product.stockQuantity - cartQty, 0);

          return (
            <div
              className="product-card"
              key={product.id}
              onClick={() => openProductDetails(product.id)}
            >
              <div className="product-icon">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  "🛍️"
                )}
              </div>

              <div className="product-content">
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>
                <p className="price">₹{product.price}</p>

                <p className="stock">
                  {availableNow > 0
                    ? `${availableNow} available`
                    : "Out of stock"}
                </p>

                <p className={product.isActive ? "active" : "inactive"}>
                  {product.isActive ? "Available" : "Inactive"}
                </p>

                {!product.isActive || product.stockQuantity <= 0 ? (
                  <button className="add-cart-button" disabled>
                    Unavailable
                  </button>
                ) : cartQty === 0 ? (
                  <button
                    className="add-cart-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="add-cart-button"
                      onClick={() => decreaseQty(product)}
                    >
                      -
                    </button>
                    <strong>{cartQty}</strong>
                    <button
                      className="add-cart-button"
                      onClick={() => increaseQty(product)}
                      disabled={cartQty >= product.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
