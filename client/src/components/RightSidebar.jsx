import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import "../css/right_sidebar.css";

const RightSidebar = ({ topics }) => {
  return (
    <>
      <div className="align-self-start position-sticky top-0 p-2">
        <ul className="d-flex flex-column gap-2">
          {topics.map((topic, i) => (
            <li
              key={topic.id}
              className="right-sidebar-item topic-li px-2 py-1"
            >
              <Link to={`/topic/${encodeURIComponent(topic.topic)}`}>
                <div className="d-flex gap-2 align-items-center">
                  <img
                    src={`/Topics/${topic.image}`}
                    className="rounded-2"
                    width={40}
                    height={40}
                    alt=""
                  />
                  <div className="d-flex flex-column">
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
