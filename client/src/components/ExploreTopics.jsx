import React, { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import TopicCategoryLinks from "./TopicCategoryLinks";

const ExploreTopics = () => {
  const [topicCategories, res] = useLoaderData();
  console.log(res);

  useEffect(() => {
    const timer = setInterval(async () => {
      const res = await fetch("/api/get-updated");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      console.log(data);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <TopicCategoryLinks topicCategory={topicCategories} />
    </>
  );
};

export default ExploreTopics;
