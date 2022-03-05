import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { Button, Form, Input, Typography, Spin, notification } from "antd";
import { Link, useHistory } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

function Login() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { Title } = Typography;

  // If already user dont show this page
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    let intended = history.location.pathname;
    if (intended) {
      return;
    } else {
      if (user && user.token) {
        history.push("/");
      }
    }
  }, [user, history]);

  const roleBaseRedirect = (res) => {
    //check if intended (login before leave a rating part)
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  const LoginForm = () => {
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
      setLoading(true);
      try {
        const result = await auth.signInWithEmailAndPassword(
          values.email,
          values.password
        );
        // send login data to redux
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        // send token to backend api
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            console.log(res.data);
            // send user to store
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
            roleBaseRedirect(res);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        // console.log(error);
        notification.error({
          message: "Error",
          description: error.message,
          class: "error",
        });
        setLoading(false);
      }
    };
    const googleSubmit = async () => {
      auth
        .signInWithPopup(googleAuthProvider)
        .then(async (result) => {
          // get login data from firebase
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();
          // send login data to store redux
          createOrUpdateUser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id,
                },
              });
              roleBaseRedirect(res);
            })
            .catch();
          history.push("/");
        })
        .catch((error) => {
          //  console.log(error);
          notification.error({
            message: "Error",
            description: error.message,
            class: "error",
          });
        });
    };

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

          <Link to="/forgot/password" className="float-end text-danger">
            Forgot password?
          </Link>

          <Form.Item className="align-items-center">
            <Button type="primary" htmlType="submit" icon={<MailOutlined />}>
              Login
            </Button>{" "}
            <Button onClick={googleSubmit} icon={<GoogleOutlined />}>
              Login with Google
            </Button>{" "}
            <Link to="/register">
              Or <a>register now!</a>
            </Link>
          </Form.Item>
        </Form>
      </>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {!loading ? (
            <Title level={2}>Login</Title>
          ) : (
            <Title level={2}>
              <Spin />
            </Title>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
