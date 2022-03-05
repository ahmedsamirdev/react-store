import React from "react";
import { Link } from "react-router-dom";
import { Collapse, Typography, List} from "antd";
import {
  UserOutlined,
  LockOutlined,
  HeartOutlined,
} from "@ant-design/icons";

function UserNav() {
  const { Panel } = Collapse;
  const {  Text } = Typography;

  const data = [
    {
      title: "History",
      icon: <UserOutlined style={{ fontSize: "16px" }} />,
      link: "/user/history",
    },
    {
      title: "Wish list",
      icon: <HeartOutlined ined style={{ fontSize: "16px" }} />,
      link: "/user/wishlist",
    },
    {
      title: "Password",
      icon: <LockOutlined style={{ fontSize: "16px" }} />,
      link: "/user/password",
    },
  ];
  return (
    <Collapse accordion={true} defaultActiveKey={["1"]}>
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

export default UserNav;
