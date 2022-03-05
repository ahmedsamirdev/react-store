import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getUserOrders } from "../../functions/user";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../components/order/Invoice";
import { Typography } from "antd";

const History = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const { Title } = Typography;
  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () =>
    getUserOrders(user.token).then((res) => {
      //console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });

  const showOrderInTable = (order) => (
    <div class="table-responsive ">
    <table className="table ">
    <thead className="table-active">
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Price</th>
        <th scope="col">Brand</th>
        <th scope="col">Color</th>
        <th scope="col">Count</th>
        <th scope="col">Shipping</th>
      </tr>
    </thead>
    <tbody>
      {order.products.map((p, i) => (
        <tr key={i}>
          <td>
            <b>{p.product.title}</b>
          </td>
          <td>{p.product.price}</td>
          <td>{p.product.brand}</td>
          <td>{p.color}</td>
          <td>{p.count}</td>
          <td>
            {p.shipping === "Yes" ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-outline-primary"
    >
      Download PDF
    </PDFDownloadLink>
  );

  const showEachOrders = () =>
    orders.reverse().map((order, i) => (
      <div key={i} className="shadow p-3 mb-5 bg-white rounded text-center">
        <ShowPaymentInfo order={order} />
        {showOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid  mt-4">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
        <Title level={2}>
            {orders.length > 0 ? "User purchase orders" : "No purchase orders"}
            </Title>
          {showEachOrders()}
        </div>
      </div>
    </div>
  );
};

export default History;