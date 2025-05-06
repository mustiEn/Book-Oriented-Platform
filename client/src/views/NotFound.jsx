import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className="text-center mt-5">
        <div>
          <h1>404</h1>
          <h3>Page Not Found</h3>
        </div>
        <Link to={"/home"} className="mt-3 btn btn-light">
          Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
