import React from "react";
import { useLoaderData } from "react-router-dom";

import PostThought from "./PostThought";

const ReaderProfileThoughts = () => {
  const { thoughts } = useLoaderData();

  console.log(thoughts);

  return (
    <>
      <ul id="thoughts" className="d-flex flex-column gap-3">
        {thoughts[0].id != null ? (
          thoughts.map((thought) => {
            return (
              <li key={thought.id} className="thought p-3">
                <PostThought data={thought} />
                <hr />
              </li>
            );
          })
        ) : (
          <div>No thoughts found</div>
        )}
      </ul>
    </>
  );
};

export default ReaderProfileThoughts;
