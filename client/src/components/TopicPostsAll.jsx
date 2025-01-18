import React from "react";
import { useLoaderData } from "react-router-dom";
import PostThought from "./PostThought";
import PostReview from "./PostReview";
import PostQuote from "./PostQuote";

const TopicPostsAll = () => {
  const { posts } = useLoaderData();
  const returnComponent = (post) => {
    let component;
    if (post.review) {
      component = <PostReview data={post} />;
    } else if (post.thought) {
      component = <PostThought data={post} />;
    } else {
      component = <PostQuote data={post} />;
    }
    return component;
  };

  console.log(posts);

  return (
    <>
      <ul>
        {posts.map((post, i) => {
          return (
            <li key={i} className="post p-3">
              {returnComponent(post)}
              <hr />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TopicPostsAll;
