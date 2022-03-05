import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import no from "../../images/no.png";
import { ShoppingCartOutlined } from "@ant-design/icons";

function SideDrawer() {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "120px",
    objectFit: "cover",
  };

  return (
    <Drawer
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      className="text-center"
      title={`Cart contains ${cart.length} Product`}
      visible={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} />
                <p className="text-center bg-dark text-light">
                  {p.title} 
                </p>
              </>
            ) : (
              <>
                <img src={no} style={imageStyle} />
                <p className="text-center bg-dark text-light">
                  {p.title} 
                </p>
              </>
            )}
          </div>
        </div>
      ))}

      <Link to="/cart" className=" items-center">
        <Button
          type="primary"
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-block"
        >
          Go To Cart <ShoppingCartOutlined style={{ fontSize: "15px" }} />
        </Button>
      </Link>
    </Drawer>
  );
}

export default SideDrawer;
