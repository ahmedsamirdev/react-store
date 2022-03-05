import React from "react";
import { Link } from "react-router-dom";
import {
  LockOutlined,
  AppstoreAddOutlined,
  SubnodeOutlined,
  DollarCircleOutlined,
  AppstoreOutlined,
  UserOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Collapse, Typography, List } from "antd";

function AdminNav() {
  const { Text } = Typography;
  const { Panel } = Collapse;

  const data = [
    {
      title: "Dashboard",
      icon: <UserOutlined style={{ fontSize: "16px" }} />,
      link: "/admin/dashboard",
    },
    {
      title: "Create Product",
      icon: <AppstoreAddOutlined ined style={{ fontSize: "16px" }} />,
      link: "/admin/product",
    },
    {
      title: "Products",
      icon: <AppstoreOutlined style={{ fontSize: "16px" }} />,
      link: "/admin/products",
    },
    {
      title: "Category",
      icon: <TagsOutlined style={{ fontSize: "16px" }} />,
      link: "/admin/category",
    },
    {
      title: "Sub Category",
      icon: <SubnodeOutlined lined style={{ fontSize: "16px" }} />,
      link: "/admin/sub",
    },
    {
      title: "Coupon",
      icon: <DollarCircleOutlined style={{ fontSize: "16px" }} />,
      link: "/admin/coupon",
    },
    {
      title: "Password",
      icon: <LockOutlined style={{ fontSize: "16px" }} />,
      link: "/user/password",
    },
  ];

  return (
    <Collapse accordion={true} defaultActiveKey={["1"]} >
      <Panel header={<Text>Dashboard</Text>} key="1">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={
                  <Link to={`${item.link}`} className="nav-link">
                    {item.title}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </Panel>
    </Collapse>
  );
}

export default AdminNav;
