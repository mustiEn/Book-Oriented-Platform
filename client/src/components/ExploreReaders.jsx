import React from "react";
import TopReaders from "./TopReaders";
import { useLoaderData } from "react-router";

const ExploreReaders = () => {
  const { bookWorms, bookWormsPremium, topQuoters, topReviewers } =
    useLoaderData();

  return (
    <>
      <TopReaders
        readers={[bookWorms, bookWormsPremium, topQuoters, topReviewers]}
      />
    </>
  );
};

export default ExploreReaders;
