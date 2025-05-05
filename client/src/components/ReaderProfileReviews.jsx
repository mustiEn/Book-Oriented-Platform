import React from "react";
import toast from "react-hot-toast";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router";
import moment from "moment";
import { FaComment } from "react-icons/fa6";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../css/reader_profile_reviews.css";
import PostReview from "./PostReview";

const ReaderProfileReviews = () => {
  const data = useLoaderData();

  return (
    <>
      <ul id="reviews" className="d-flex flex-column gap-3">
        {data.readerReviews.length > 0 ? (
          data.readerReviews.map((review) => {
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

export const loadReaderReviews = async ({ params }) => {
  const { profile: username } = params;
  const response = await fetch(`/api/${username}/get-reader-reviews`);
  console.log(username);

  if (!response.ok) {
    toast.error("Something went wrong");
    throw new Error(response);
  }
  const data = await response.json();
  return data;
};
