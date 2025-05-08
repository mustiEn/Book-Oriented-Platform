import React, { Suspense } from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import BookDetailsSection from "../components/BookDetailsSection";
import { ClipLoader } from "react-spinners";

const BookDetails = () => {
  const [bookDetails, readerBookInteractionData] = useLoaderData();

  return (
    <>
      <BookDetailsSection
        bookDetails={bookDetails[0]}
        readerBookInteractionData={readerBookInteractionData[0]}
      />

      <Suspense
        fallback={
          <ClipLoader
            color="#cf7e05"
            className="position-fixed top-50 end-50 start-50"
          ></ClipLoader>
        }
      >
        <div className="w-100 p-4">
          <Outlet context={bookDetails[0]} />
        </div>
      </Suspense>
    </>
  );
};

export default BookDetails;
