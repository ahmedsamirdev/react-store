import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { useSelector } from "react-redux";
import { getCategories } from "../../../functions/category";
import { createSub, getSub, removeSub, getSubs } from "../../../functions/sub";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { notification, Typography, Spin } from "antd";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { Title } = Typography;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubs = () => getSubs().then((sub) => setSubs(sub.data));

  const handleSubmit = (values) => {
    // e.preventDefault();
    console.log(values);
    const { name } = values;
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        notification.success({
          message: "Success",
          description: `"${res.data.name}" is created`,
          class: "success",
        });
        loadSubs();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) {
          notification.error({
            message: "Error",
            description: err.response.data,
            class: "error",
          });
        }
      });
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          notification.success({
            message: "Success",
            description: `${res.data.name} deleted!`,
            class: "error",
          });
          loadSubs();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setLoading(false);
            notification.error({
              message: "Error",
              description: err.response.data,
              class: "error",
            });
          }
        });
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">
              <Spin />
            </h4>
          ) : (
            <Title level={2}>Create sub category</Title>
          )}

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <hr />
          {/* step 2 and step 3 */}
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          {/* step 5 */}

          {subs.filter(searched(keyword)).map((sub) => (
            <div className="bg-light  rounded-2 my-2 p-2" key={sub._id}>
              <Link to={`/admin/sub/${sub.slug}`}>{sub.name}</Link>
              <span
                onClick={() => handleRemove(sub.slug)}
                style={{ marginLeft: "auto", cursor: "pointer" }}
                className="float-end "
              >
                <DeleteOutlined
                  className="text-danger"
                  style={{ fontSize: "100%" }}
                />
              </span>
              <Link to={`/admin/sub/${sub.slug}`}>
                <span
                  style={{
                    marginLeft: "auto",
                    marginRight: 6,
                    cursor: "pointer",
                  }}
                  className="float-end "
                >
                  <EditOutlined
                    className="text-warning"
                    style={{ fontSize: "100%" }}
                  />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
