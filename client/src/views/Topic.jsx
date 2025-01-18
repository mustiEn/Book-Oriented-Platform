import React from "react";
import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FaArrowLeft } from "react-icons/fa6";

const Topic = () => {
  const { topic } = useLoaderData();
  const navigate = useNavigate();
  // console.log(topic);

  return (
    <>
      <div
        className="position-sticky top-0"
        style={{ backgroundColor: "#121212d4" }}
      >
        <FaArrowLeft
          id="arrow-left"
          className="rounded-circle p-2"
          onClick={() => navigate(-1)}
        />
        <span></span>
      </div>
      <div className="d-flex align-items-center mt-4">
        {topic.image.includes(".") ? (
          <img src={`/Topics/${topic.image}`} width={60} alt="" />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: 60 + "px" }}
          >
            {topic.topic.slice(0, 1)}
          </div>
        )}
        <div className="d-flex flex-column gap-2 ms-3">
          <div>{topic.topic}</div>
          <div>{topic.topicFollowerCount} followers</div>
        </div>
        <Button className="ms-auto" size="sm">
          Follow
        </Button>
      </div>
      <ul className="d-flex gap-2">
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/topic/${topic.topic}`}
            end
          >
            Books
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/topic/${topic.topic}/posts`}
          >
            Posts
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/topic/${topic.topic}/readers`}
          >
            Readers
          </NavLink>
        </li>
      </ul>
      <hr className="mb-3 mt-0" />
      <Outlet />
    </>
  );
};

export default Topic;
