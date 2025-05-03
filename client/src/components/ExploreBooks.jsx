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
    whatShallIread,
  } = useLoaderData();
  return (
    <>
      <div className="px-2">
        <div className="d-flex gap-2 my-4">
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
            whatShallIread,
          ]}
        />
      </div>
    </>
  );
};

export default ExploreBooks;
