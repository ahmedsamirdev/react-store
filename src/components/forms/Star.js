import React from "react";
import StarRatings from "react-star-ratings";

function Star({ starClick, numberOfStars }) {
  return (
    <>
      <StarRatings
        changeRating={() => starClick(numberOfStars)}
        numberOfStars={numberOfStars}
        starDimension="20px"
        starSpacing="2px"
        starHoverColor="#ffa41c"
        starEmptyColor="#ffa41c"
      />
      <br />
    </>
  );
}

export default Star;
