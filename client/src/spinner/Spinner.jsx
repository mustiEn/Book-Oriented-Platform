import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = ({ pendingVal }) => {
  return (
    <>
      {pendingVal && (
        <ClipLoader
          color="#cf7e05"
          className="position-fixed top-50 end-50 start-50"
        ></ClipLoader>
      )}
    </>
  );
};

export default Spinner;
