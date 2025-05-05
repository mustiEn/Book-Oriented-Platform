import React from "react";
import { useLoaderData, Outlet } from "react-router";
import BookDetailsSection from "../components/BookDetailsSection";

const BookDetails = () => {
  const [bookDetails, readerBookInteractionData] = useLoaderData();

  return (
    <>
      <BookDetailsSection
        bookDetails={bookDetails[0]}
        readerBookInteractionData={readerBookInteractionData[0]}
      />
      <div className="w-100 p-4">
        <Outlet context={bookDetails[0]} />
      </div>
    </>
  );
};

export default BookDetails;
