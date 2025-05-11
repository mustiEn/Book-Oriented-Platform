import React from "react";
import { useLoaderData } from "react-router-dom";
import TopBooks from "./TopBooks";
import BackNavigation from "./BackNavigation";

const BookCategory = () => {
  const {
    category,
    mostRead,
    mostLiked,
    highestRated,
    mostReadLastMonth,
    mostReadLastYear,
  } = useLoaderData();

  return (
    <>
      <BackNavigation innerHtml={`${category.category} Books`} />
      <div className="p-2">
        <TopBooks
          books={[
            mostRead,
            mostLiked,
            highestRated,
            mostReadLastMonth,
            mostReadLastYear,
          ]}
        />
      </div>
    </>
  );
};

export default BookCategory;
