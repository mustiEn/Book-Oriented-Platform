import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import Button from "react-bootstrap/Button";
import BackNavigation from "../components/BackNavigation";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";

const Topic = () => {
  const [topic] = useLoaderData();
  const [isFollowing, setIsFollowing] = useState(topic.isFollowing);
  const [followerCount, setFollowerCount] = useState(topic.follower_count);
  const [pending, setPending] = useState(false);
  const ref = useRef(false);

  const sendFollowingState = async () => {
    try {
      const res = await fetch(`/api/set-following-state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: topic.id,
          isFollowing: isFollowing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setPending(false);
      setFollowerCount((prev) => prev + (isFollowing ? 1 : -1));
      toast.success(`You ${isFollowing ? "followed" : "unfollowed"}`);
    } catch (error) {
      setPending(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (ref.current) {
      const timer = setTimeout(() => {
        sendFollowingState();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isFollowing]);

  return (
    <>
      <BackNavigation innerHtml={topic.topic} />
      <div className="d-flex align-items-center my-4 px-3">
        {topic.image.includes(".") ? (
          <img
            src={`/Topics/${topic.image}`}
            className="rounded-2"
            width={60}
            alt=""
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: 60 + "px" }}
          >
            {topic.topic.slice(0, 1)}
          </div>
        )}
        <div className="d-flex flex-column gap-2 ms-3">
          <div className="fw-bold">{topic.topic}</div>
          <div style={{ fontSize: 12 + "px" }}>{followerCount} followers</div>
        </div>
        <Button
          className="ms-auto"
          variant={"outline-light"}
          size="sm"
          onClick={() => {
            setIsFollowing((prev) => !prev);
            ref.current = true;
            setPending(true);
          }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
      <ul className="d-flex px-3 gap-2">
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
      <Spinner pendingVal={pending} />
    </>
  );
};

export default Topic;
