import React, { useEffect, useState } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { getOrders, changeStatus } from "../../functions/admin";
import { useSelector, useDispatch } from "react-redux";
import Orders from "../../components/order/Orders";
import { notification,Typography } from "antd";

const AdminDashboard = () => {
  const { Title } = Typography;
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getOrders(user.token).then((res) => {
      // console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      notification.success({
        message: "Success",
        description: "Status Updated.",
        class: "success",
      });
      // console.log("status updated");
      loadOrders();
    });
  };
  return (
    <div className="container-fluid  mt-4">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10 ">
          <Title level={2}>Admin dashboard</Title>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
