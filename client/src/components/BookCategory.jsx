import React from "react";
import { useLoaderData } from "react-router-dom";
import TopBooks from "./TopBooks";

const BookCategory = () => {
  const {
    mostRead,
    mostLiked,
    highestRated,
    mostReadLastMonth,
    mostReadLastYear,
  } = useLoaderData();

  return (
    <>
      <TopBooks
        books={[
          mostRead,
          mostLiked,
          highestRated,
          mostReadLastMonth,
          mostReadLastYear,
        ]}
      />
    </>
  );
};

export default BookCategory;
