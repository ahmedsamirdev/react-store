import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";
import { Spin, Tag } from "antd";

const SubList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs().then((res) => {
      setSubs(res.data);
      setLoading(false);
    });
  }, []);

  const showSubs = () =>
    subs.map((s) => (
      <Link to={`/sub/${s.slug}`} key={s._id}>
        <Tag color="#2db7f5" className=" px-3 py-2 mx-2 rounded">
          {s.name}
        </Tag>
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
          showSubs()
        )}
      </div>
    </div>
  );
};

export default SubList;
