import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BackNavigation = ({ innerHtml }) => {
  const navigate = useNavigate();
  return (
    <div
      className="position-sticky top-0"
      style={{ backgroundColor: "#121212d4" }}
    >
      <FaArrowLeft
        id="arrow-left"
        className="rounded-circle p-2"
        onClick={() => navigate(-1)}
      />
      <span>{innerHtml}</span>
    </div>
  );
};

export default BackNavigation;
