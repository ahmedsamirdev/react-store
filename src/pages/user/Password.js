import React, { useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
import { Button, Form, Typography, Input, notification, Spin } from "antd";
import { LockOutlined,MailOutlined } from "@ant-design/icons";

function Password() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;

  const handleSubmit = async (values) => {
    setLoading(true);
    setPassword("");
    // update user password with firebase
    await auth.currentUser
      .updatePassword(values.password)
      .then(() => {
        setLoading(false);
        notification.success({
          message: "Success",
          description: "Password updated.",
          class: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        notification.error({
          message: "Error",
          description: error.message,
          class: "error",
        });
      });
  };
  const passwordUpdateForm = () => (
    <Form
      name="normal_login"
      className="login-form"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your new Password!",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Enter Your new password"
          type="password"
        />
      </Form.Item>
      <Form.Item >
        <Button type="primary" htmlType="submit" icon={<MailOutlined />}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-2">
          <UserNav />
        </div>
        <div className="col-md-6">
          {!loading ? (
            <Title level={2}>Password update</Title>
          ) : (
            <Title level={2}>
              <Spin />
            </Title>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
}

export default Password;
