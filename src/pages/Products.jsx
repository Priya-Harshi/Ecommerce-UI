import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

const API_URL = "https://localhost:7042/api/Product";

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
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
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.productId === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stockQuantity) {
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
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }

    setMessage(`${product.name} added to cart.`);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-icon">🛍️</div>

            <div className="product-content">
              <h2>{product.name}</h2>

              <p className="description">{product.description}</p>

              <p className="price">₹{product.price}</p>

              <p className="stock">
                {product.stockQuantity > 0
                  ? `${product.stockQuantity} available`
                  : "Out of stock"}
              </p>

              <p className={product.isActive ? "active" : "inactive"}>
                {product.isActive ? "Available" : "Inactive"}
              </p>

              <button
                className="add-cart-button"
                disabled={!product.isActive || product.stockQuantity <= 0}
                onClick={() => addToCart(product)}
              >
                {product.stockQuantity > 0 && product.isActive
                  ? "Add to Cart"
                  : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
