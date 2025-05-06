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
