import React from "react";
import { useLoaderData } from "react-router-dom";
import PostThought from "./PostThought";

const TopicPostsThought = () => {
  const { posts } = useLoaderData();

  console.log(posts);

  return (
    <>
      <ul>
        {posts.map((thought) => {
          return (
            <li key={thought.id} className="thought p-3">
              <PostThought data={thought} />
              <hr />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TopicPostsThought;
