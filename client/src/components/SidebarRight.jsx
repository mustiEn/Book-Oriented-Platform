import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import "../css/right_sidebar.css";
import { useMedia } from "use-media";

const RightSidebar = ({ topics, ref }) => {
  const isWide = useMedia({ minWidth: "992px" });

  return (
    <>
      <div
        id="rightSidebar"
        className={
          !isWide ? "d-none" : "align-self-start position-sticky top-0 p-2"
        }
        ref={ref}
      >
        <div className="w-100 border border-opacity-50 border-secondary rounded-5 p-3 ">
          <h5>Topics</h5>
          <ul className="d-flex flex-column gap-2">
            {topics.map((topic, i) => (
              <li
                key={topic.id}
                className="right-sidebar-item topic-li w-100 px-2 py-1"
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
            <li className="right-sidebar-item topic-li w-100 px-2 py-1">
              <Link to="/explore/topics" className="d-block">
                See more topics
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-100 border border-opacity-50 border-secondary rounded-5 p-3 mt-3">
          <h5>Subscribe to Premium</h5>
          <p>
            Get full access to exclusive features and content — upgrade to
            premium now!
          </p>
          <Button variant="light" as={Link} to="/premium">
            Subscribe
          </Button>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
