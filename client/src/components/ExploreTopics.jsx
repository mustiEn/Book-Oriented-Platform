import React from "react";
import { useLoaderData } from "react-router-dom";
import TopicCategoryLinks from "./TopicCategoryLinks";

const ExploreTopics = () => {
  const data = useLoaderData();
  return (
    <>
      <TopicCategoryLinks topicCategory={data} />
    </>
  );
};

export default ExploreTopics;
