import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category";
import { Spin ,Tag} from "antd";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories().then((c) => {
      setCategories(c.data);
      setLoading(false);
    });
  }, []);

  const showCategories = () =>
    categories.map((c) => (
      <Link to={`/category/${c.slug} `} key={c._id}>
          <Tag color="#108ee9" className=" px-3 py-2 mx-2 rounded">{c.name}</Tag>
      </Link>
    ));

  return (
    <div className="container">
      <div className="text-center justify-content-between">
        {loading ? (
          <h4 className="text-center">
            <Spin />
          </h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
