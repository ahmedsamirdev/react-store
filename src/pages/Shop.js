import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";
import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { Slider, Checkbox, Radio } from "antd";
import Star from "../components/forms/Star";
import { Collapse, Tag, Typography, Empty } from "antd";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([20, 499]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");
  const { Panel } = Collapse;

  const { search } = useSelector((state) => ({ ...state }));

  const { Title } = Typography;
  const { text } = search;

  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts();
    //fetch categories
    getCategories().then((res) => setCategories(res.data));
    //fetch sub categories
    getSubs().then((res) => setSubs(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  // 1. load product by default
  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  // 2. load product on user search
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load product on price range
  useEffect(() => {
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // we could reset what choose before get star products
    setPrice(value);
    // setSub('')
    //setBrand('')
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };
  // 4. load product on category
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="ob-2 pl-4 pr-4"
          name="category"
          value={c._id}
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  //handle check for categories (dont duplicate check before send to backend)
  const handleCheck = (e) => {
    //reset search value
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // setPrice('0,0')
    // setSub('')
    //setBrand('')
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // indexOf method (if not found returns -1 else returns index)
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      //if found pull one item from index
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. load product on stars
  const handleStarClick = (num) => {
    //reset search value
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // we could reset what choose before get star products
    // setPrice([0,0])
    // setCategories([])
    setStar(num);
    // setSub('')
    //setBrand('')

    fetchProducts({ stars: num });
  };
  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  //6. show products by sub categories
  const showSubs = () =>
    subs.map((s) => (
      <Tag
        key={s._id}
        style={{margin:1, cursor: "pointer" }}
        onClick={() => handleSub(s)}
        color="#2db7f5"
      >
        {s.name}
      </Tag>
    ));
  const handleSub = (sub) => {
    setSub(sub);
    //reset search value
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // we could reset what choose before get star products
    // setPrice([0,0])
    // setCategories([])
    // setStar('');
    //setBrand('')
    fetchProducts({ sub });
  };
  //7. fetch products on brands
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-1 pr-4"
      >
        {b}
      </Radio>
    ));
  const handleBrand = (e) => {
    //reset search value
    // setSub('');
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // we could reset what choose before get star products
    // setPrice([0,0])
    // setCategories([])
    // setStar('');
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };
  //8. fetch product on colors
  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-1 pr-4"
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    //reset search value
    // setSub('');
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // we could reset what choose before get star products
    // setPrice([0,0])
    // setCategories([])
    // setStar('');
    // setBrand('')
    setColor(e.target.value);
    fetchProducts({ color: e.target.value });
  };
  // 9. show products on shipping
  const showShipping = () => (
    <>
      <Checkbox
        value="Yes"
        checked={shipping === "Yes"}
        onChange={handleShippingChange}
        className="pb-2 pl-4 pr-4"
      >
        Yes
      </Checkbox>
      <Checkbox
        value="No"
        checked={shipping === "No"}
        onChange={handleShippingChange}
        className="pb-2 pl-4 pr-4"
      >
        No
      </Checkbox>
    </>
  );
  const handleShippingChange = (e) => {
    //reset search value
    // setSub('');
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // we could reset what choose before get star products
    // setPrice([0,0])
    // setCategories([])
    // setStar('');
    // setBrand('')
    //setColor('');
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-md-3 p-4">
          <Title level={4}>Filters</Title>
          <Collapse defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}>
            {/* Price Range */}
            <Panel header="Price Range" key="1">
              <Slider
                className="ml-4 mr-4"
                tipFormatter={(v) => `$${v}`}
                value={price}
                max="4999"
                onChange={handleSlider}
                range
              />
            </Panel>
            {/* Category */}
            <Panel header="Category" key="2">
              {showCategories()}
            </Panel>
            {/* Stars */}
            <Panel header="Stars" key="3">
              {showStars()}
            </Panel>
            {/* Sub-Category */}
            <Panel header="Sub Categories" key="4">
              {showSubs()}
            </Panel>
            {/* Brands */}
            <Panel header="Brands" key="5">
              {showBrands()}
            </Panel>
            {/* Colors */}
            <Panel header="Colors" key="6">
              {showColors()}
            </Panel>
            {/* Shipping */}
            <Panel header="Shopping" key="7">
              {showShipping()}
            </Panel>
          </Collapse>
        </div>
        <div className="col-md-9  mt-4">
          <div className="row pb-5 ">
            <Title level={2}>
              {products.length < 1 ? (
                <Empty className="text-center" description={"No products"} />
              ) : (
                "Products"
              )}
            </Title>
            {products.map((p) => (
              <div key={p._id} className="col-md-4">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
