import React, { useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LeftSidebar from "../components/SidebarLeft";
import RightSidebar from "../components/SidebarRight";
import { useInView } from "react-intersection-observer";

const Layout = () => {
  const loggedInReader = useLoaderData();
  const [sidebarTopics, setSidebarTopics] = useState([]);
  const { ref: topicsRef, inView: topicsInView } = useInView();
  const fetchSidebarTopics = async () => {
    const res = await fetch("/api/get-sidebar-topics");

    if (!res.ok) throw new Error(res.error);

    const data = await res.json();
    setSidebarTopics(data);
  };

  useEffect(() => {
    if (topicsInView) {
      fetchSidebarTopics();
    }
  }, [topicsInView]);

  return (
    <>
      <div className={"d-flex justify-content-center"}>
        <LeftSidebar
          ref={topicsRef}
          topics={topicsInView}
          loggedInReader={loggedInReader}
        />
        <div
          id="MainContent"
          className="flex-shrink-0 border-end border-opacity-50 border-secondary border-start"
        >
          <Outlet context={loggedInReader} />
        </div>
        <RightSidebar ref={topicsRef} topics={sidebarTopics} />
      </div>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
};

export default Layout;
