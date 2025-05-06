import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import TopicCategoryLinks from "./TopicCategoryLinks";
import { toast } from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import Button from "react-bootstrap/esm/Button";

const ExploreTopics = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [topicCategories, topicsDict] = useLoaderData();
  const { trendingTopics: trendingTopicsArr, popularTopics } = topicsDict;
  const [followingStates, setFollowingStates] = useState(
    [...trendingTopicsArr, ...popularTopics].reduce((acc, curr) => {
      acc[curr.id] = curr.isFollowing;
      return acc;
    }, {})
  );
  const [isTopicFollowed, setIsTopicFollowed] = useState({
    topicId: null,
    isFollowed: false,
  });
  const [pending, setPending] = useState(false);
  console.log(followingStates);

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
      setPending(false);
      toast.success(
        `You ${isTopicFollowed.isFollowed ? "followed" : "unfollowed"}`
      );
    } catch (error) {
      console.log(error);
      setPending(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setTrendingTopics(trendingTopicsArr);
  }, []);

  useEffect(() => {
    if (isTopicFollowed.topicId != null) {
      const timer = setTimeout(() => {
        sendFollowingState();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isTopicFollowed]);

  useEffect(() => {
    if (navigation.state === "loading") {
      setPending(true);
    } else {
      setPending(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    const timer = setInterval(async () => {
      const res = await fetch("/api/get-trending-topics");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      console.log(data);
      setTrendingTopics(data);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="px-2">
        <TopicCategoryLinks topicCategory={topicCategories} />
        <div className="my-4">
          <div className="h6">Trending Topics</div>
          <ul>
            {trendingTopics.length != 0 ? (
              trendingTopics.map((topic, i) => (
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
                    <Button
                      size="sm"
                      variant="outline-light"
                      className="ms-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsTopicFollowed({
                          topicId: topic.id,
                          isFollowed: followingStates[topic.id] ? 0 : 1,
                        });
                        setPending(true);
                        console.log(followingStates[topic.id]);
                      }}
                    >
                      {followingStates[topic.id] ? "Unfollow" : "Follow"}
                    </Button>
                  </Link>
                </li>
              ))
            ) : (
              <div>No data found</div>
            )}
          </ul>
        </div>
        <div>
          <div className="h6">Popular Topics</div>
          <ul>
            {popularTopics.map((topic, i) => (
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
                  <Button
                    size="sm"
                    variant="outline-light"
                    className="ms-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsTopicFollowed({
                        topicId: topic.id,
                        isFollowed: followingStates[topic.id] ? 0 : 1,
                      });
                      setPending(true);
                      console.log(followingStates[topic.id]);
                    }}
                  >
                    {followingStates[topic.id] ? "Unfollow" : "Follow"}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Spinner pendingVal={pending} />
    </>
  );
};

export default ExploreTopics;
