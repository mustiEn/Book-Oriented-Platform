import React, { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Spinner from "../spinner/Spinner";

const Layout = () => {
  const [loggedInReader, sidebarTopics] = useLoaderData();
  const [pending, setPending] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      setPending(true);
    } else {
      setPending(false);
    }
  }, [navigation.state]);
  // console.log("layout loader", useLoaderData());

  return (
    <>
      <div className="d-flex">
        <LeftSidebar loggedInReader={loggedInReader} />
        <div
          id="MainContent"
          className="border-end border-opacity-50 border-secondary border-start"
        >
          <Outlet context={loggedInReader} />
        </div>
        <RightSidebar topics={sidebarTopics} />
      </div>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      {/* <Spinner pendingVal={pending} /> */}
    </>
  );
};

export default Layout;
