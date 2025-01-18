import React from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import BookDetailsSection from "../components/BookDetailsSection";

const BookDetails = () => {
  const data = useLoaderData();
  console.log(data);

  return (
    <>
      <BookDetailsSection
        bookDetails={data.bookDetails}
        readerBookDetailsHeader={data.readerBookDetailsHeader}
      />
      <div className="w-100 p-4">
        <Outlet context={data.bookDetails} />
      </div>
    </>
  );
};

export default BookDetails;
