import React from "react";
import { useLoaderData, Outlet } from "react-router-dom";
import BookDetailsSection from "../components/BookDetailsSection";
import RightSidebar from "../components/RightSidebar";

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
      <RightSidebar />
    </>
  );
};

export default BookDetails;
