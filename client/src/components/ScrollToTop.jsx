import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router"; // if using React Router

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
export default ScrollToTop;

// Use this component at the top of your app where does this func go
