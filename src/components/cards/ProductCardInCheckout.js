import React from "react";
import ModalImage from "react-modal-image";
import no from "../../images/no.png";
import { useDispatch } from "react-redux";
import { Input,notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  const dispatch = useDispatch();

  const handleColorChange = (e) => {
    let cart = [];
    //get items from cart (localstorage)
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //update the color of product
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].color = e.target.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };
  const handleQuantityChange = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value;
    if (count > p.quantity) {
      notification.error({
        message: "Error",
        description: `Max available Quantity: ${p.quantity}`,
        class: "error",
      });

      return;
    }
    let cart = [];
    //get items from cart (localstorage)
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //update the quantity of product
      cart.map((product, i) => {
        if (product._id == p._id) {
          cart[i].count = count;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = (e) => {
    let cart = [];
    //get items from cart (localstorage)
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // remove product when id matched
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart.splice(i, 1);
        }
      });
      //update localstorage and redux
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {p.images.length ? (
              <ModalImage
                small={p.images[0].url}
                large={p.images[0].url}
                alt={p.title}
              />
            ) : (
              <ModalImage medium={no} large={no} alt={p.title} />
            )}
          </div>
        </td>

        <td>{p.title}</td>
        <td>${p.price}</td>
        <td>{p.brand}</td>
        <td className="text-center">
          <select
            onChange={handleColorChange}
            className="form-control"
            name="color"
            id=""
          >
            {p.color ? (
              <option value={p.color}>{p.color}</option>
            ) : (
              <option value="">Select</option>
            )}
            {colors
              //filter for duplicate color
              .filter((c) => c !== p.color)
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </td>

        <td className="text-center">
          <Input 
            type="number"
            value={p.count}
            onChange={handleQuantityChange}
            className="form-control"
          />
        </td>
        <td className="text-center">
          {p.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className="text-center">
          <DeleteOutlined
            onClick={handleRemove}
            className="text-danger pointer"
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
