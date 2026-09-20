import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);

    updateCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>My Cart 🛒</h1>
          <p>Review your items before checkout.</p>
        </div>

        <Link to="/products" className="continue-shopping">
          ← Continue Shopping
        </Link>
      </div>

      <hr />

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>Add some products to your cart to get started.</p>

          <Link to="/products" className="shop-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item-icon">🛍️</div>

                <div className="cart-item-details">
                  <h3>{item.name}</h3>

                  <p className="item-price">₹{item.price}</p>

                  <div className="quantity-section">
                    <span>Quantity:</span>

                    <button
                      className="quantity-button"
                      onClick={() => decreaseQuantity(item.productId)}
                    >
                      −
                    </button>

                    <span className="quantity">{item.quantity}</span>

                    <button
                      className="quantity-button"
                      onClick={() => increaseQuantity(item.productId)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>

                <div className="item-subtotal">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
