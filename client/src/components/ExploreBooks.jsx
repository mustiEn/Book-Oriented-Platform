import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import TopBooks from "./TopBooks";

const ExploreBooks = () => {
  const {
    mostRead,
    mostLiked,
    highestRated,
    mostReadLastMonth,
    mostReadLastYear,
  } = useLoaderData();
  return (
    <>
      <div>
        <Link className="btn btn-outline-light" to="/book-categories">
          Book Categories
        </Link>
        <Link className="btn btn-outline-light" to="">
          Authors
        </Link>
      </div>
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

export default ExploreBooks;
