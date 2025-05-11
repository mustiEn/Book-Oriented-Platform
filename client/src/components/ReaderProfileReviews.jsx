import React from "react";
import { useLoaderData } from "react-router-dom";
import "../css/reader_profile_reviews.css";
import PostReview from "./PostReview";

const ReaderProfileReviews = () => {
  const { readerReviews } = useLoaderData();

  return (
    <>
      <ul id="reviews" className="d-flex flex-column gap-3">
        {readerReviews.length > 0 ? (
          readerReviews.map((review) => {
            return (
              <li key={review.id} className="review p-3">
                <PostReview data={review} />
                <hr />
              </li>
            );
          })
        ) : (
          <div>No reviews found</div>
        )}
      </ul>
    </>
  );
};
export default ReaderProfileReviews;
