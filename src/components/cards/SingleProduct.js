import React from "react";
import { Card, Tabs, Tooltip, notification, Typography } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import no from "../../images/no.png";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import _ from "loadsh";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist } from "../../functions/user";

//child of product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const { TabPane } = Tabs;
  const { Title } = Typography;
  const { title, images, description, _id } = product;
  //redux
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  //cart structure
  const handleAddToCart = () => {
    //create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      //if cart is in localstorage then GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      //remove duplicates (use loadsh to check if equal to any present product in cart)
      let unique = _.uniqWith(cart, _.isEqual);
      //save to localStorage
      //console.log(unique)
      localStorage.setItem("cart", JSON.stringify(unique));
      //add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
    }
  };
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token);
    notification.success({
      message: "Success",
      description: `Added to Wishlist.`,
      class: "success",
    });
  };

  return (
    <>
      {/* Left Section */}
      <div className="col-md-6">
        {images && images.length ? (
          <Carousel
            showArrows={true}
            style={{ width: 100 }}
            autoPlay
            infiniteLoop
          >
            {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
          </Carousel>
        ) : (
          <Card cover={<img src={no} className="mb-3 card-image" />}></Card>
        )}
        {/* Tabs */}
        <Tabs type="card" className="mt-4">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call use on xxxx xxx xxx to learn more about this product.
          </TabPane>
        </Tabs>
      </div>
      {/* Empty Space in middle */}
      <div className="col-md-2"></div>
      {/* Empty Space in middle */}

      {/* Right Section */}
      <div className="col-md-4">
        <Title level={2} className="text-center">
          {title}
        </Title>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-1">No rating yet!</div>
        )}
        <Card
          actions={[
            <>
              <Tooltip
                title={product.quantity < 1 ? "Out of stock" : "Add to Cart"}
              >
                <a
                  onClick={product.quantity < 1 ? "" : handleAddToCart}
                  disabled={product.quantity < 1}
                >
                  <ShoppingCartOutlined className="text-success" />
                  <br />
                  {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
                </a>
              </Tooltip>
            </>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </a>,

            <RatingModal>
              <StarRating
                changeRating={onStarClick}
                name={_id}
                numberOfStars={5}
                rating={star}
                isSelectable={true}
                starHoverColor="#ffd814"
                starRatedColor="#ffa41c"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
