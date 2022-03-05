import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Input, notification, Typography, Spin } from "antd";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function CategoryCreate() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { Title } = Typography;

  // read all categories
  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  useEffect(() => {
    loadCategories();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = (values) => {
    const { name } = values;
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        notification.success({
          message: "Success",
          description: `${res.data.name} is created.`,
          class: "success",
        });
        loadCategories();
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400) {
          notification.error({
            message: "Error",
            description: error.response.data,
            class: "error",
          });
        }
      });
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          notification.success({
            message: "Success",
            description: `${res.data.name} deleted.`,
            class: "success",
          });
          loadCategories();
        })
        .catch((error) => {
          if (error.response.status === 400) {
            setLoading(false);
            notification.error({
              message: "Error",
              description: error.response.data,
              class: "error",
            });
          }
        });
    }
  };

  const categoryForm = () => (
    <Form onFinish={handleSubmit}>
      <Form.Item name="name" className=" my-2">
        <Input
          placeholder="Category Name"
          className="form-control"
          value={name}
          autoFocus
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="btn btn-outlined-primary"
      >
        Save
      </Button>
    </Form>
  );

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-2">
            <AdminNav />
          </div>
          <div className="col">
            {loading ? <Spin /> : <Title level={2}>Create category</Title>}
            {categoryForm()}
            {categories.map((category) => (
              <div className="bg-light  rounded-2 my-2 p-2" key={category._id}>
                {category.name}
                <span
                  onClick={() => handleRemove(category.slug)}
                  className="float-end "
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                >
                  <DeleteOutlined
                    className="text-danger"

                    style={{ fontSize: "100%" }}
                  />
                </span>
                <Link to={`/admin/category/${category.slug}`}>
                  <span className="float-end mr-2 ">
                    <EditOutlined
                      className="text-warning "
                      style={{ fontSize: "100%", marginRight: "20px" }}
                    />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryCreate;
