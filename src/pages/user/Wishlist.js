import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { Typography, Empty ,notification} from "antd";
import { getWishlist, removeWishlist } from "../../functions/user";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

function Wishlist() {
  const [wishList, setWishList] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const { Title } = Typography;

  useEffect(() => {
    loadWishList();
  }, []);

  const loadWishList = () => {
    getWishlist(user.token).then((res) => {
      setWishList(res.data.wishlist);
    });
  };
  const handleRemove = (productId) => {
    removeWishlist(productId, user.token).then((res) => res.data);
    notification.success({
      message: "Success",
      description: `Wish item deleted`,
      class: "success",
    });
    loadWishList();
  };
  return (
    <div className="container-fluid  mt-4">
      <div className="row">
        <div className="col-2 ">
          <UserNav />
        </div>
        {wishList.length > 0 ? (
          <div className="col-md">
            <Title level={2}>{wishList.length && "Wish list"}</Title>
            {wishList.map((wish) => (
              <div className="bg-light  rounded-2 my-2 p-2" key={wish._id}>
                <Link to={`/product/${wish.slug}`}>{wish.title}</Link>
                <span
                  onClick={() => handleRemove(wish._id)}
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                  className="float-end "
                >
                  <DeleteOutlined
                    className="text-danger"
                    style={{ fontSize: "100%" }}
                  />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Empty className="text-center" description={"No products in wish list"} />
        )}
      </div>
    </div>
  );
}

export default Wishlist;
