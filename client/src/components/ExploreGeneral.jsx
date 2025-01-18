import React, { useEffect, useState } from "react";
import TopicCategoryLinks from "./TopicCategoryLinks";
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuid } from "uuid";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "../css/explore_general.css";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";

const ExploreGeneral = () => {
  const navigation = useNavigation();
  const [topicCategories, generalData] = useLoaderData();
  const { topics, bookWorms, topLikedBooks } = generalData;
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

  return (
    <>
      <TopicCategoryLinks topicCategory={topicCategories} />
      <div className="px-2">
        <div>
          <div className="h6">Topics</div>
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
        <div>
          <div className="h6">Books</div>
          <div className="text-center px-3">
            In order for us to recommend you books, you need to add at least 10
            books you read to your profile.
          </div>
          <div className="text-center px-3">
            When creating recommendations, we pay attention to whether you liked
            a book and your rates,
          </div>
        </div>
        <div>
          <div className="h6">Book Worms</div>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView="auto"
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              reverseDirection: false,
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
            }}
          >
            {bookWorms.map((bookWorm) => (
              <SwiperSlide
                key={bookWorm.id}
                // className="user-li px-2 py-1 rounded-2"
                style={{
                  backgroundColor: "#c6cacc14",
                  // width: "80%",
                }}
              >
                <a
                  href={`/${encodeURIComponent(bookWorm.username)}`}
                  className="d-flex flex-column align-items-center"
                >
                  <img
                    src={
                      bookWorm.profile_photo == null
                        ? "https://placehold.co/100x100"
                        : `/Pps_and_Bgs/${bookWorm.profile_photo}`
                    }
                    className="rounded-circle mt-3"
                    width={100}
                    height={100}
                    alt=""
                  />
                  <div className="d-flex flex-column align-items-center my-2">
                    <div
                      className="d-flex flex-column align-items-center fw-bold"
                      style={{ fontSize: 14 + "px" }}
                    >
                      <span>{bookWorm.firstname}</span>
                      <span>{bookWorm.lastname}</span>
                    </div>
                    <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                      @{bookWorm.username}
                    </div>
                  </div>
                  <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                    {bookWorm.books_read} books
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="my-5">
          <div className="h6">The most liked books</div>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={45}
            slidesPerView="auto"
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              reverseDirection: false,
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
            }}
          >
            {topLikedBooks.map((book) => (
              <SwiperSlide key={book.bookId}>
                <a
                  href={`/book/${encodeURIComponent(book.title)}/${
                    book.bookId
                  }`}
                  className="d-flex flex-column"
                >
                  <img
                    src={
                      book.thumbnail == null
                        ? "https://placehold.co/120x180"
                        : book.thumbnail
                    }
                    className="rounded-3"
                    width={120}
                    height={180}
                    alt=""
                  />
                  <div className="my-2">
                    <div
                      className="fw-bold"
                      style={{ fontSize: 14 + "px" }}
                      title={book.title}
                    >
                      {book.truncatedTitle}
                    </div>
                    <div
                      className="d-flex text-pale"
                      style={{ fontSize: 13 + "px" }}
                    >
                      {book.rate != null ? (
                        <>
                          <div className="d-flex align-items-center gap-1">
                            <svg
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 32 32"
                              fill="rgb(182, 182, 182)"
                              key={uuid()}
                            >
                              <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                            </svg>
                            {book.rate}
                          </div>
                          <span className="dot-separator">&#183;</span>
                        </>
                      ) : (
                        ""
                      )}
                      <div>{book.liked_count} likes</div>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Spinner pendingVal={pending} />
    </>
  );
};

export default ExploreGeneral;
