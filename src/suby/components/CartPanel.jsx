import React from "react";
import { API_URL } from "../api";
import { useCart } from "../cart/CartContext";

const CartPanel = () => {
    const {
        items,
        total,
        itemCount,
        isOpen,
        paymentComplete,
        changeQuantity,
        payBill,
        setIsOpen
    } = useCart();

    return (
        <>
            <button
                className="cartToggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open cart"
            >
                🛒 Cart {itemCount > 0 && <span>{itemCount}</span>}
            </button>

            {isOpen && (
                <>
                    <button
                        className="cartBackdrop"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close cart"
                    />
                    <aside className="cartPanel">
                    <div className="cartPanelHeader">
                        <h2>🛒 Your Cart</h2>
                        <button onClick={() => setIsOpen(false)} aria-label="Close cart">×</button>
                    </div>

                    {paymentComplete ? (
                        <div className="paymentSuccess">
                            <div>🎉</div>
                            <h3>Payment Successful</h3>
                            <p>Thank you for your order!</p>
                            <small>Your order is placed.</small>
                            <button onClick={() => setIsOpen(false)}>Continue browsing</button>
                        </div>
                    ) : items.length === 0 ? (
                        <p className="emptyCart">Your cart is empty.</p>
                    ) : (
                        <>
                            <div className="cartItems">
                                {items.map((item) => (
                                    <div className="cartItem" key={item._id}>
                                        {item.image && (
                                            <img
                                                src={`${API_URL}/uploads/${item.image}`}
                                                alt={item.productName}
                                            />
                                        )}
                                        <div className="cartItemInfo">
                                            <strong>{item.productName}</strong>
                                            <span>₹{item.price} × {item.quantity}</span>
                                        </div>
                                        <div className="quantityControls">
                                            <button onClick={() => changeQuantity(item._id, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => changeQuantity(item._id, 1)}>+</button>
                                        </div>
                                        <strong>₹{Number(item.price) * item.quantity}</strong>
                                    </div>
                                ))}
                            </div>
                            <div className="cartTotal">
                                <strong>Total</strong>
                                <strong>₹{total}</strong>
                            </div>
                            <button className="payButton" onClick={payBill}>
                                💳 Pay ₹{total}
                            </button>
                        </>
                    )}
                    </aside>
                </>
            )}
        </>
    );
};

export default CartPanel;
