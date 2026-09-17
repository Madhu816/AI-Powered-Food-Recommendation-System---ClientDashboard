import React from 'react';
import { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { useParams } from 'react-router-dom';
import TopBar from './TopBar';
import Review from './Review';
import { useCart } from '../cart/CartContext';

const ProductMenu = () => {

  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  const { firmId, firmname } = useParams();

  const productHandler = async () => {

    try {

      const response = await fetch(`${API_URL}/product/${firmId}/products`);
      const newProductData = await response.json();

      setProducts(newProductData.product);

    } catch (error) {

      console.log("Failed to fetch data:", error);

      alert("Failed to fetch the data");

    }

  };

  useEffect(() => {
    productHandler();
  }, []);

  return (
    <>
      <TopBar />

      <div>

        <section className="productSection">

          <h1
            className="productMenuFirmName"
            style={{ textAlign: 'center' }}
          >
            {firmname.toUpperCase()} HOTEL
          </h1>


          {products.map((item, index) => {
            const hasUploadedImage = item.image &&
              item.image !== "undefined" &&
              item.image !== "null";

            return (

              <div
                className="productBox"
                key={item._id || index}
              >

                {/* PRODUCT DETAILS */}

                <div className="productItems">

                  <h3>
                    {item.productName}
                  </h3>

                  <div className="productPrice">
                    ₹{item.price}
                  </div>

                  <p>
                    {item.description}
                  </p>

                </div>


                {/* IMAGE + ADD + REVIEW */}

                <div className="productGroup">

                  {hasUploadedImage && (
                    <img
                      src={`${API_URL}/uploads/${item.image}`}
                      alt={item.productName}
                      className="productImage"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  )}

                  <button className="addbtn" onClick={() => addToCart(item)}>
                    ADD
                  </button>


                  {/* REVIEW */}

                  <Review
                    productId={item._id}
                  />

                </div>

              </div>

            );

          })}

        </section>

      </div>
    </>
  );
};

export default ProductMenu;