import React from "react";
import { useLoaderData } from "react-router-dom";
import PostQuote from "./PostQuote";

const TopicPostsQuote = () => {
  const { posts } = useLoaderData();

  console.log(posts);

  return (
    <>
      <ul>
        {posts.map((quote) => {
          return (
            <li key={quote.id} className="quote p-3">
              <PostQuote data={quote} />
              <hr />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TopicPostsQuote;
