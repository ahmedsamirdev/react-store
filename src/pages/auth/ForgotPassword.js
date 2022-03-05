import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, notification, Typography, Form, Input, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;

  // Forgot password method
  const handleSubmit = async (values) => {
    setLoading(true);
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth
      .sendPasswordResetEmail(values.email, config)
      .then(() => {
        //setEmail("");
        setLoading(false);
        notification.success({
          message: "Success",
          description: "Check your email for password reset link.",
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
        //console.log("error", error);
      });
  };

  // If already user dont show this page
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();

  return (

    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? (
        <h4 className="text-danger">
          <Spin />
        </h4>
      ) : (
        <Title level={2}>Forgot password</Title>
      )}
      <Form
        name="normal_login"
        className="login-form"
        onFinish={handleSubmit}
        autoComplete="off"
      >
   

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            type="email"
            autoFocus
          />
        </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>




      </Form>
    </div>
  );
}

export default ForgotPassword;
