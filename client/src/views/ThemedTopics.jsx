import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../css/themed_topics.css";
import toast from "react-hot-toast";
import BackNavigation from "../components/BackNavigation";

const ThemedTopics = () => {
  const topics = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const [followingStates, setFollowingStates] = useState(
    topics.reduce((acc, curr) => {
      acc[curr.id] = curr.isFollowing;
      return acc;
    }, {})
  );
  const [isTopicFollowed, setIsTopicFollowed] = useState({
    topicId: null,
    isFollowed: false,
  });
  const sendFollowingState = async () => {
    try {
      const res = await fetch(`/api/set-following-state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: isTopicFollowed.topicId,
          isFollowed: isTopicFollowed.isFollowed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      console.log(data);
      setFollowingStates((prev) => ({
        ...prev,
        [isTopicFollowed.topicId]: prev[isTopicFollowed.topicId] ? 0 : 1,
      }));
      toast.success(
        `You ${isTopicFollowed.isFollowed ? "followed" : "unfollowed"}`
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isTopicFollowed.topicId != null) {
      const timer = setTimeout(() => {
        sendFollowingState();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isTopicFollowed]);

  console.log(topics);
  console.log(followingStates);

  return (
    <>
      <BackNavigation innerHtml={`Topics related to ${params.category}`} />
      <ul className="d-flex flex-column gap-2">
        {topics.map((topic, i) => (
          <li key={topic.id} className="themed-topic">
            <Link
              to={`/topic/${encodeURIComponent(topic.topic)}`}
              className="d-flex align-items-center border rounded-3 p-3 gap-2"
            >
              <div className="me-2">{i + 1}</div>
              {topic.image.includes(".") ? (
                <img
                  src={`/Topics/${topic.image}`}
                  className="rounded-3"
                  alt=""
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center rounded-3"
                  style={{
                    backgroundColor: topic.image,
                    width: 45 + "px",
                    height: 45 + "px",
                  }}
                >
                  {topic.topic.slice(0, 1)}
                </div>
              )}
              <div>
                <div className="fst-bold">{topic.topic}</div>
                <div style={{ color: "#bab4ab", fontSize: 13 + "px" }}>
                  {topic.post_count} posts
                </div>
              </div>
              <Button
                size="sm"
                variant="dark"
                className="ms-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsTopicFollowed({
                    topicId: topic.id,
                    isFollowed: followingStates[topic.id] ? 0 : 1,
                  });
                  console.log(followingStates[topic.id]);
                }}
              >
                {followingStates[topic.id] ? "Unfollow" : "Follow"}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ThemedTopics;
