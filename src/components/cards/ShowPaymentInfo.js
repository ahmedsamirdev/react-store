import React from "react";
import { Col } from "antd";
import { Typography, Tag } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

function ShowPaymentInfo({ order }) {
  const { Text } = Typography;

  return (
    <>
      <Col className="text-center">
        {!order.paymentIntent.id ? null : (
          <Text>Order Id: {order.paymentIntent.id}</Text>
        )}
        <br />
        <Text>
          Amount:{" "}
          {(order.paymentIntent.amount /= 100).toLocaleString("en-GB", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
        <br />
        <Text>Currency: {order.paymentIntent.currency.toUpperCase()}</Text>
        <br />
        <Text>Method: {order.paymentIntent.payment_method_types[0]}</Text>
        <br />
        <Text>Payment: {order.paymentIntent.status.toUpperCase()}</Text>
        <br />
        <Text>
          Ordered on:{" "}
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </Text>
        <br />
        {/* order status */}
        {order.orderStatus === "Not Processed" && (
          <Tag className="my-2" icon={<MinusCircleOutlined />} color="default">
            Not Processed
          </Tag>
        )}

        {order.orderStatus === "Processing" && (
          <Tag className="my-2" icon={<SyncOutlined spin />} color="processing">
            Processing
          </Tag>
        )}
        {order.orderStatus === "Dispatched" && (
          <Tag className="my-2" icon={<ClockCircleOutlined />} color="default">
            Dispatched
          </Tag>
        )}

        {order.orderStatus === "Cancelled" && (
          <Tag className="my-2" icon={<CloseCircleOutlined />} color="error">
            Cancelled
          </Tag>
        )}

        {order.orderStatus === "Completed" && (
          <Tag className="my-2" icon={<CheckCircleOutlined />} color="success">
            Completed
          </Tag>
        )}

        {order.orderStatus === "Cash on Delivery" && (
          <Tag
            className="my-2"
            icon={<ExclamationCircleOutlined />}
            color="warning"
          >
            Cash on Delivery
          </Tag>
        )}
      </Col>
    </>
  );
}

export default ShowPaymentInfo;
