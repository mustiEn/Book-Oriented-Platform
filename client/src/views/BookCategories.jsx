import React from "react";
import { Outlet } from "react-router-dom";
import RightSidebar from "../components/RightSidebar";

const BookCategories = () => {
  return (
    <>
      <Outlet />
      <RightSidebar />
    </>
  );
};

export default BookCategories;
