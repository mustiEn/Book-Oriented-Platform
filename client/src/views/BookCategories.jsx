import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";

const BookCategories = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default BookCategories;
