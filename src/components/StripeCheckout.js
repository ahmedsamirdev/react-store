import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link, useHistory } from "react-router-dom";
import { Card, Result, Button } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import { createOrder, emptyUserCart } from "../functions/user";
import { Statistic, Alert, Row, Col } from "antd";

const StripeCheckout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, coupon } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const [check, setCheck] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      console.log("create payment intent", res.data);
      setClientSecret(res.data.clientSecret);
      //additional res received on successful payment
      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here you get result after successful payment
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          //empty cart from local storage
          if (typeof window !== "undefined") localStorage.removeItem("cart");
          //empty cart from redux
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          //reset coupon to false
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          redirect();
          //empty cart from database
          emptyUserCart(user.token);
        }
      });
      // create order and save in database for admin to process
      // empty user cart from redux store and local storage
      //console.log(JSON.stringify(payload, null, 4));
      setCheck(payload);
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    // listen for changes in the card element
    // and display any errors as the custoemr types their card details
    setDisabled(e.empty); // disable pay button if errors
    setError(e.error ? e.error.message : ""); // show error message
  };

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const success = () => (
    <Result
      status="success"
      title="Payment Successful"
      subTitle={`Order number: ${check.paymentIntent.id}`}
      extra={[
        <>
          <Link to="/user/history">
            <Button type="primary" key="redirect">
              Go to your purchase history
            </Button>
            <br />
            <p>You are being redirected ..</p>
            <br />
            <Button type="primary">Back Home</Button>
          </Link>
        </>
      ]}
    />
  );
  const redirect = () => {
    const direct = setTimeout(() => {
      history.push("/user/history");
    }, 2000);
    return () => clearTimeout(direct);
  };

  return (
    <>
      {succeeded && success()}
      {!succeeded && (
        <div className="text-center pb-5">
          <Row gutter={16} className="my-4">
            <Col span={12}>
              <Statistic
                title="Total"
                value={cartTotal}
                prefix={<DollarOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Payable"
                value={(payable / 100).toFixed(2)}
                prefix={<CheckOutlined />}
              />
            </Col>
          </Row>

          {coupon && totalAfterDiscount !== undefined ? (
            <Alert
              message={`Total after discount: $${totalAfterDiscount}`}
              type="success"
            />
          ) : (
            <Alert message="No coupon applied" type="error" />
          )}
        </div>
      )}

      {!succeeded && (
        <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
          <CardElement
            id="card-element"
            options={cartStyle}
            onChange={handleChange}
          />
          <button
            className="stripe-button"
            disabled={processing || disabled || succeeded}
          >
            <span id="button-text">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay"
              )}
            </span>
          </button>
          <br />
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default StripeCheckout;
