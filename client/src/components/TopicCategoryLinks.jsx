import React from "react";
import { Link } from "react-router-dom";
import "../css/topic_category.css";

const TopicCategoryLinks = ({ topicCategory }) => {
  return (
    <div className="d-flex flex-wrap gap-2">
      {topicCategory.map((category) => (
        <Link
          key={category.id}
          to={`/topic-category/${encodeURIComponent(category.topic_category)}`}
          className="topic-category-item rounded-5 py-1 px-2"
        >
          {category.topic_category}
        </Link>
      ))}
    </div>
  );
};

export default TopicCategoryLinks;
