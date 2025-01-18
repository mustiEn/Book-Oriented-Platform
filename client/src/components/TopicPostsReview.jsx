import React from "react";
import { useLoaderData } from "react-router-dom";
import PostReview from "./PostReview";

const TopicPostsReview = () => {
  const { posts } = useLoaderData();

  console.log(posts);

  return (
    <>
      <ul>
        {posts.map((review) => {
          return (
            <li key={review.id} className="review p-3">
              <PostReview data={review} />
              <hr />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TopicPostsReview;
