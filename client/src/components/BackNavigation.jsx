import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BackNavigation = ({ innerHtml }) => {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex align-items-center position-sticky p-1 top-0 z-3"
      style={{ backgroundColor: "#121212d4" }}
    >
      <FaArrowLeft
        id="arrow-left"
        className="rounded-circle p-2 ms-1"
        style={{ width: 35 + "px", height: 35 + "px" }}
        onClick={() => navigate(-1)}
      />
      <span className="m-1">{innerHtml}</span>
    </div>
  );
};

export default BackNavigation;
