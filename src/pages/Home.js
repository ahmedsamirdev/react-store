import NewArrivals from "../components/home/NewArrivals";
import React from "react";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/category/CategoryList";
import SubList from "../components/sub/SubList";
import { Divider, Typography } from "antd";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const { Title } = Typography;

function Home() {
  const images = [
    {
      image: "./1.jpg",
      title: "b",
    },
    {
      image: "./2.jpg",
      title: "c",
    },
    {
      image: "./3.jpg",
      title: "b",
    },
  ];
  return (
    <>
      {/* <div className="container my-2">
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          autoPlay
          infiniteLoop
          emulateTouch={true}
        >
          {images.map((i) => (
            <img src={i.image} key={i.title} />
          ))}
        </Carousel>
      </div> */}
      <Divider orientation="center" className="mt-5 ">
        <Title> New Arrivals</Title>
      </Divider>
      <NewArrivals />
      <Divider orientation="center" className="mt-5 ">
        <Title>Best Sellers</Title>
      </Divider>
      <BestSellers />
      <Divider orientation="center" className="mt-5 ">
        <Title>Categories</Title>
      </Divider>
      <CategoryList />
      <Divider orientation="center" className="mt-5 ">
        <Title>Sub Categories</Title>
      </Divider>
      <SubList />
      <br />
      <br />
      <br />
    </>
  );
}

export default Home;
