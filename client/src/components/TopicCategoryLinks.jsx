import React from "react";
import { Link } from "react-router-dom";
// import "../css/topic_category.css";

const TopicCategoryLinks = ({ topicCategory }) => {
  const styles = {
    backgroundColor: "black",
    color: "white",
    fontSize: 13 + "px",
  };
  return (
    <div className="d-flex flex-wrap gap-2">
      {topicCategory.map((category) => (
        <Link
          key={category.id}
          to={`/topic-category/${encodeURIComponent(category.topic_category)}`}
          className="topic-category-item rounded-5 py-1 px-2"
          style={styles}
        >
          {category.topic_category}
        </Link>
      ))}
    </div>
  );
};

export default TopicCategoryLinks;
