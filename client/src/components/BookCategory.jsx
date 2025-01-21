import React from "react";
import { useLoaderData } from "react-router-dom";

const BookCategory = () => {
  const data = useLoaderData();
  console.log(data);

  return <div>BookCategory</div>;
};

export default BookCategory;
