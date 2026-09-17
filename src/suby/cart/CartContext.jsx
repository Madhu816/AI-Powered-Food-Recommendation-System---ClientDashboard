import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const addToCart = (product) => {
        setPaymentComplete(false);
        setItems((previous) => {
            const existing = previous.find((item) => item._id === product._id);
            if (existing) {
                return previous.map((item) => item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item);
            }

            return [...previous, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const changeQuantity = (productId, amount) => {
        setItems((previous) => previous
            .map((item) => item._id === productId
                ? { ...item, quantity: item.quantity + amount }
                : item)
            .filter((item) => item.quantity > 0));
    };

    const total = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
        [items]
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const payBill = () => {
        if (!items.length) {
            return;
        }

        setPaymentComplete(true);
        setItems([]);
    };

    return (
        <CartContext.Provider value={{
            items,
            total,
            itemCount,
            isOpen,
            paymentComplete,
            addToCart,
            changeQuantity,
            payBill,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
