import React, { useState, useEffect } from "react";
import { getProduct, productStar } from "../functions/product";
import { Link, useParams, useHistory } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import { getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
import { Typography,Empty} from "antd";

function Product() {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState();
  const [related, setRelated] = useState([]);
  const {  Text } = Typography;

  //redux
  const { user } = useSelector((state) => ({ ...state }));
  let { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  //retrieve rating stars if he rated
  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  });

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);

      //load related products
      getRelated(res.data._id).then((res) => {
        setRelated(res.data);
      });
    });
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token)
      .then((res) => {
       // console.log("yes rate", res.data);
        loadSingleProduct();
      })
      .catch((error) => {
        //
      });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <Text strong>Related Products</Text>
          <hr />
        </div>
        <div className="row pb-5">
          {related.length ? (
            related.map((r) => (
              <div className=" col-md-4" key={r._id}>
                <ProductCard product={r} />
              </div>
            ))
          ) : (
            <Empty className="text-center" description={"No Products Found"} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
