import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = ({ pendingVal }) => {
  return (
    <>
      {pendingVal ? (
        // <div className="d-flex justify-content-center my-3">
        <ClipLoader
          color="#cf7e05"
          className="position-fixed top-50 end-50 start-50"
        ></ClipLoader>
      ) : (
        // </div>
        ""
      )}
    </>
  );
};

export default Spinner;
