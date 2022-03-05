import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Result, Button } from "antd";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  let history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && history.push("/");
    // cleanup
    return () => clearInterval(interval);
  }, [count, history]);

  return (
    <div className="container p-5 text-center">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <>
            <p>Redirecting you in {count} seconds</p>
            <Button type="primary">Back Home</Button>
          </>
        }
      />
    </div>
  );
};

export default LoadingToRedirect;
