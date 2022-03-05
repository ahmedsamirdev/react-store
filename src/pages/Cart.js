import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import {
  Button,
  Statistic,
  Empty,
  notification,
  Input,
  InputNumber,
  Select,
} from "antd";
import { userCart } from "../functions/user";
import { Typography, Image, Table, List } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import no from "../images/no.png";

const Cart = ({ history }) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { Title, Text } = Typography;
  const { Option } = Select;

  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  //get total prices
  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  //get total items
  let totalItems = 0;
  for (const item of cart) {
    totalItems += parseInt(item.count);
  }

  // fn to save cart data to database and redirect if successed
  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        // console.log("cart pushed");
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => console.log("cart save err", err));
  };

  // fn to save cart data to database and set redux state as Cash on delivery
  const saveCashOrderToDb = () => {
    dispatch({
      type: "COD",
      payload: "ture",
    });
    userCart(cart, user.token)
      .then((res) => {
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => console.log("cart save err", err));
  };

  const showCartItems = () => (
    <div class="table-responsive ">
      <table className="table table-sm">
        <thead className="table-active">
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>

        {cart.map((p) => (
          <ProductCardInCheckout key={p._id} p={p} />
        ))}
      </table>
    </div>
  );

  const handleRemove = (_id) => {
    let cart = [];
    //get items from cart (localstorage)
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // remove product when id matched
      cart.map((product, i) => {
        if (product._id === _id._id) {
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

  const handleColorChange = (_id, value) => {
    let cart = [];
    //get items from cart (localstorage)
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //update the color of product
      cart.map((product, i) => {
        if (product._id === _id._id) {
          cart[i].color = value.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row ">
        <div className="col-md">
          <Title level={2}>Cart</Title>
          {!cart.length ? (
            <p className="text-center">
              <Empty
                description={
                  <p>
                    No products in cart.
                    <Link to="/shop"> Continue Shopping.</Link>
                  </p>
                }
              />
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        {cart.length ? (
          <div className="col-md-3">
            <Title level={2}>Order Summary</Title>
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Text className="mb-3">
                      {`$ ${item.price.toLocaleString(2)}`}
                    </Text>,
                  ]}
                >
                  <List.Item.Meta
                    title={<Text>{item.title}</Text>}
                    description={
                      item.count > 1
                        ? `${item.count} Items`
                        : `${item.count} Item`
                    }
                  />
                </List.Item>
              )}
            />

            <hr />
            <div className="d-flex  mb-3 flex-row-reverse">
              <Statistic
                title={totalItems > 1 ? `Items` : `Item`}
                value={totalItems}
                prefix="&nbsp;"
                style={{ marginLeft: "auto" }}
              />

              <Statistic title="Total" prefix="$" value={getTotal()} />
            </div>

            {user ? (
              <span className="d-flex row">
                <Button
                  onClick={saveOrderToDb}
                  type="primary"
                  disabled={!cart.length}
                >
                  Proceed to Checkout
                </Button>
                <br />
                <Button
                  className="mt-2"
                  onClick={saveCashOrderToDb}
                  type="secondary"
                  disabled={!cart.length}
                >
                  Pay Cash on Delivery
                </Button>
              </span>
            ) : (
              <Button type="primary">
                <Link
                  to={{
                    pathname: "/login",
                    state: { from: "cart" },
                  }}
                >
                  Login to Checkout
                </Link>
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Cart;
