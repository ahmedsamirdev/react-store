import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateCategory, getCategory } from "../../../functions/category";
import { notification,  Spin } from "antd";

function CategoryUpdate() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  let { slug } = useParams();

  // read single category
  const loadCatgeory = () => {
    getCategory(slug).then((cat) => setName(cat.data.name));
  };

  useEffect(() => {
    loadCatgeory();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateCategory(slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        notification.success({
          message: "Success",
          description: `${res.data.name} is updated.`,
          class: "success",
        });
        history.push("/admin/category");
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

  const categoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div name="name" className=" my-2">
        <input
          placeholder="Category Name"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          autoFocus
        />
        <br />
        <button
          type="primary"
          htmlType="submit"
          className="btn btn-outlined-primary"
        >
          Save
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-2">
            <AdminNav />
          </div>
          <div className="col">
            {loading ? <Spin /> : <h4>Update category</h4>}
            {categoryForm()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryUpdate;
