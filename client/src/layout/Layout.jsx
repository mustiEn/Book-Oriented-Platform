import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const { reader } = useLoaderData();
  console.log(reader);

  return (
    <>
      <Sidebar pos={"start-0"} loggedInReader={reader} />
      <div
        id="content"
        style={{
          width: 700 + "px",
          border: 1 + "px solid white",
          minHeight: 100 + "vh",
        }}
        // className="h-100"
      >
        <Outlet context={reader} />
      </div>
      {/* <Sidebar pos={"end-0"} /> */}
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
};

export default Layout;

export const loadLoggedInReader = async () => {
  const response = await fetch("/api/get-reader-username");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  return data;
};
