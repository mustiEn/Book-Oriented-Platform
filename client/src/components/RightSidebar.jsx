import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import "../css/right_sidebar.css";

const RightSidebar = ({ topics }) => {
  console.log(topics);

  return (
    <>
      <div className="align-self-start position-sticky top-0 p-2">
        <ul>
          {topics.map((topic, i) => (
            <li key={topic.id} className="topic-li px-2 py-1">
              <Link
                to={`/topic/${encodeURIComponent(topic.topic)}`}
                className="d-flex align-items-center"
              >
                <div>{i}</div>
                <div className="d-flex align-items-center ms-2">
                  <img
                    src={`/Topics/${topic.image}`}
                    className="rounded-2"
                    width={40}
                    height={40}
                    alt=""
                  />
                  <div className="d-flex flex-column ms-2">
                    <div className="fw-bold">{topic.topic}</div>
                    <div
                      className="d-flex text-pale"
                      style={{ fontSize: 13 + "px" }}
                    >
                      <div>{topic.follower_count} followers</div>
                      <span className="dot-separator">&#183;</span>
                      <div>{topic.post_count} posts</div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default RightSidebar;
