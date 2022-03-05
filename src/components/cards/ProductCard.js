import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import no from "../../images/no.png";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "loadsh";
import { useSelector, useDispatch } from "react-redux";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  // destructure
  const { images, title, description, slug, price } = product;
  //redux
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  //cart structure
  const handleAddToCart = () => {
    //create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      //if cart is in localstorage then GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      //remove duplicates (use loadsh to check if equal to any present product in cart)
      let unique = _.uniqWith(cart, _.isEqual);
      //save to localStorage
      //console.log(unique)
      localStorage.setItem("cart", JSON.stringify(unique));
      //add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      //show items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-1 text-muted">No rating yet</div>
      )}

      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : no}
            style={{ height: "235px", objectFit: "contain" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <Tooltip
            title={
              product.quantity < 1 ? "Out of stock" : "Add to Cart" 
            }
          >
            <a
              onClick={product.quantity < 1 ? "" : handleAddToCart}
              disabled={product.quantity < 1}
            >
              <ShoppingCartOutlined className="text-danger" /> <br />
              {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
