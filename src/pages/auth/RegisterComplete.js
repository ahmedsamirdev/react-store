import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";
import { Button, Form, Input, notification, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

function RegisterComplete() {
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();

  let history = useHistory();
  const dispatch = useDispatch();
  const { Title } = Typography;

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegisteration"));
    form.setFieldsValue({
      email: email,
    });
  }, [email]);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (values) => {
    //validation
    if (!values.email || !values.password) {
      notification.error({
        message: "Error",
        description: "Email and password required.",
        class: "error",
      });
      return;
    }
    if (values.password.length < 6) {
      notification.error({
        message: "Error",
        description: "Password must be at least 6 characters.",
        class: "error",
      });
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        values.email,
        window.location.href
      );
      if (result.user.emailVerified) {
        // remove user from local storage
        window.localStorage.removeItem("emailForRegisteration");
        //get user id token
        let user = auth.currentUser;
        await user.updatePassword(values.password);
        const idTokenResult = await user.getIdTokenResult();
        // send user to store
        createOrUpdateUser(idTokenResult.token)
          .then((res) =>
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            })
          )
          .catch((error) => console.log(error));
        //redirect
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: error.message,
        class: "error",
      });
    }
  };
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <Title level={2}>Complete Registeration</Title>
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={email}
                type="email"
                autoFocus
                disabled
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                type="password"
              />
            </Form.Item>
            <Button
              type="primary"
              //disabled={! /// }
              htmlType="submit"
              icon={<MailOutlined />}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterComplete;
