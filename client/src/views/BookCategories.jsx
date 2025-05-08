import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const BookCategories = () => {
  return (
    <>
      <Suspense
        fallback={
          <ClipLoader
            color="#cf7e05"
            className="position-fixed top-50 end-50 start-50"
          ></ClipLoader>
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
};

export default BookCategories;
