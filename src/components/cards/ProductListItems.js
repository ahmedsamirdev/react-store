import React from "react";
import { Link } from "react-router-dom";
import { List, Spin, Typography } from "antd";

const ProductListItems = ({ product }) => {
  const { price, category, subs, shipping, color, brand, quantity, sold } =
    product;

  const { Text } = Typography;
  const { Item } = List;

  return (
    <>
      <Item actions={[<Text className="mb-3">${price}</Text>]}>
        <Item.Meta title={<Text>Price</Text>} />
      </Item>
      {!category ? (
        <Spin />
      ) : (
        <Item
          actions={[
            <Text className="mb-3">
              <Link
                to={`/category/${category.slug}`}
                className="label label-default label-pill pull-xs-right"
              >
                {category.name}
              </Link>
            </Text>,
          ]}
        >
          <List.Item.Meta title={<Text>Category</Text>} />
        </Item>
      )}

      {!subs ? (
        <Spin />
      ) : (
        <>
          {subs.map((s) => (
            <Item
              actions={[
                <Text className="mb-3">
                  <Link
                    key={s._id}
                    to={`/sub/${s.slug}`}
                    className="label label-default label-pill pull-xs-right"
                  >
                    {s.name}
                  </Link>
                </Text>,
              ]}
            >
              <List.Item.Meta title={<Text>Sub Categories</Text>} />
            </Item>
          ))}
        </>
      )}

      <List.Item
        key={shipping}
        actions={[<Text className="mb-3">{shipping}</Text>]}
      >
        <List.Item.Meta title={<Text>Shipping</Text>} />
      </List.Item>

      <List.Item key={color} actions={[<Text className="mb-3">{color}</Text>]}>
        <List.Item.Meta title={<Text>Color</Text>} />
      </List.Item>

      <List.Item key={brand} actions={[<Text className="mb-3">{brand}</Text>]}>
        <List.Item.Meta title={<Text>Brand</Text>} />
      </List.Item>

      <List.Item
        key={quantity}
        actions={[<Text className="mb-3">{quantity}</Text>]}
      >
        <List.Item.Meta title={<Text>Available</Text>} />
      </List.Item>

      <List.Item key={sold} actions={[<Text className="mb-3">{sold}</Text>]}>
        <List.Item.Meta title={<Text>Sold</Text>} />
      </List.Item>
    </>
  );
};

export default ProductListItems;
