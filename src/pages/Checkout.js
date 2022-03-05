import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  saveUserAddress,
  applyCoupon,
  emptyUserCart,
  createCashOrderForUser,
} from "../functions/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  notification,
  Alert,
  Row,
  Button,
  List,
  Statistic,
  Col,
  Typography,
  Input,
} from "antd";

const Checkout = ({ history }) => {
  const { Text, Title } = Typography;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  //discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      // console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    //remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    //remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    //remove from backend api
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      notification.success({
        message: "Success",
        description: "Cart is empty, Continue shopping!",
        class: "success",
      });
    });
  };

  const saveAddressToDb = () => {
    //  console.log(address)
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        notification.success({
          message: "Success",
          description: "Address saved.",
          class: "success",
        });
      }
    });
  };
  let totalItems = 0;
  for (const item of products) {
    totalItems += parseInt(item.count);
  }

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <Button type="primary" className="mt-2" onClick={saveAddressToDb}>
        Save
      </Button>
    </>
  );
  const showProductSummary = () => {
    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={products}
          renderItem={(p) => (
            <List.Item
              actions={[
                <Text className="mb-3">
                  {`$ ${p.price.toLocaleString(2)}`}
                </Text>,
              ]}
            >
              <List.Item.Meta
                title={<Text>{p.product.title} ({(p.color)})</Text>}
                description={
                  p.count > 1 ? `${p.count} Items` : `${p.count} Item`
                }
              />
            </List.Item>
          )}
        />

        <hr />
        <div className="d-flex  flex-row-reverse">
          <Statistic
            title={totalItems > 1 ? `Items` : `Item`}
            value={totalItems}
            prefix="&nbsp;"
            style={{ marginLeft: "auto" }}
          />

          {totalAfterDiscount > 0 ? (
            <Title level={5} delete>
              $ {total.toLocaleString(2)}
            </Title>
          ) : (
            <Col>
              <Text>Total</Text>
            {/* fix period in currency */}
              <Title level={5}>$ {total.toLocaleString(2)}</Title>
            </Col>
          )}
        </div>
      </>
      // )
    );
  };

  const applyDiscountCoupon = () => {
    // console.log("send coupon to backend", coupon);
    applyCoupon(user.token, coupon).then((res) => {
      console.log("RES ON COUPON APPLIED", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied (true/ false)
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }
      // error
      if (res.data.err) {
        setDiscountError(res.data.err);
        // update redux coupon applied
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const showApplyCoupon = () => (
    <>
      <Input
        type="text"
        className="form-control"
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
      />
      <Button type="primary" onClick={applyDiscountCoupon} className="mt-2">
        Apply
      </Button>
    </>
  );
  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
      // console.log("cash,", res);
      if (res.data.ok) {
        // then we need to reset next values
        //empty localStorage
        if (typeof window !== "undefined") localStorage.removeItem("cart");
        // empty redux cart
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        // empty redux coupon
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        // empty redux cod
        dispatch({
          type: "COD",
          payload: false,
        });
        //empty cart in backend
        emptyUserCart(user.token);
        //redirect to user history
        setTimeout(() => {
          history.push("/user/history");
        }, 2000);
      }
    });
  };

  return (
    <div className="row mt-4 px-4">
      <div className="col-md-7">
        <Title level={2}>Delivery Address</Title>
        {showAddress()}
        <br />
        <br />
        <br />
        <Title level={2}>Got Coupon?</Title>
        {showApplyCoupon()}
        <br />
        <br />
        {discountError && (
          <Alert message={discountError} type="error" showIcon />
        )}
      </div>

      <div className="col-md-5">
        <Title level={2}>Order Summary</Title>

        {showProductSummary()}
        <div className="mb-4 ">
          {totalAfterDiscount > 0 && (
            <Alert
              message="Discount Applied"
              description={
                <Row>
                  Total Payable:&nbsp;
                  <Title level={5}>
                    ${`${totalAfterDiscount.toLocaleString(2)}`}
                  </Title>
                </Row>
              }
              type="success"
              showIcon
            />
          )}
        </div>
        <div className="d-flex row">
          {COD ? (
            <Button
              type="primary"
              onClick={createCashOrder}
              disabled={!addressSaved || !products.length}
            >
              Place Order
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => history.push("/payment")}
              disabled={!addressSaved || !products.length}
            >
              Place Order
            </Button>
          )}
          <br />
          <br />
          <Button
            disabled={!products.length}
            onClick={emptyCart}
            type="primary"
          >
            Empty Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
