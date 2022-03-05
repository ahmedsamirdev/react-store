import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button,notification, Input, Form, Typography } from "antd";
import { UserOutlined,MailOutlined } from "@ant-design/icons";

const { Title } = Typography;

function Register() {
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <Title level={2}>Register</Title>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default Register;

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (values) => {
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(values.email, config);
    notification.success({
      message: "Success",
      description: `Email is sent to ${values.email}. Click the link to complete your registeration`,
      class: "success",
    });
    // Save email in local storage
    window.localStorage.setItem("emailForRegisteration", values.email);
    // Clear input state
    //setEmail("");
  };

  // If already user dont show this page
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user]);

  return (
    <>
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
          icon={<MailOutlined />}
        >
          Register
        </Button>
      </Form>
    </>
  );
};
