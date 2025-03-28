import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const Layout = () => {
  const [loggedInReader, sidebarTopics] = useLoaderData();
  console.log(loggedInReader);

  return (
    <>
      <div className="d-flex">
        <LeftSidebar loggedInReader={loggedInReader} />
        <div
          id="MainContent"
          className="border-end border-opacity-50 border-secondary border-start"
        >
          <Outlet context={[loggedInReader]} />
        </div>
        <RightSidebar topics={sidebarTopics} />
      </div>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
};

export default Layout;
