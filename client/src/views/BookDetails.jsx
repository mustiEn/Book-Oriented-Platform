import React from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import BookDetailsSection from "../components/BookDetailsSection";

const BookDetails = () => {
  const [bookDetails, readerBookDetailsHeader] = useLoaderData();

  return (
    <>
      <BookDetailsSection
        bookDetails={bookDetails}
        readerBookDetailsHeader={readerBookDetailsHeader}
      />
      <div className="w-100 p-4">
        <Outlet context={bookDetails} />
      </div>
    </>
  );
};

export default BookDetails;
