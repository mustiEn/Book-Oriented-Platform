import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaArrowLeft, FaComment, FaBookmark, FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const PostQuote = ({ data }) => {
  const post = data;
  const formatDate = (date) => {
    const time = dayjs(date).local();
    if (dayjs().diff(time, "year") >= 1) {
      // Format as DD/MM/YYYY
      return time.format("DD.MM.YYYY");
    } else {
      // Format as "X minutes/hours/days ago"
      return time.fromNow();
    }
  };
  return (
    <>
      {post.topic != null ? (
        <div
          className="topic-userPp position-relative float-start"
          style={{ width: 55 + "px" }}
        >
          <LazyLoadImage
            src={`/Topics/${post.topic_image}`}
            width="35"
            height="35"
            alt=""
            className="rounded-2"
          />
          <img
            src="https://placehold.co/40x40"
            alt=""
            className="userPp rounded-circle position-absolute end-0"
            style={{ top: 40 + "%" }}
          />
        </div>
      ) : (
        <img
          src="https://placehold.co/45x45"
          alt=""
          className="userPp rounded-circle float-start"
        />
      )}
      <div className="d-flex flex-column gap-2">
        <div className="quote-header d-flex gap-2 ms-2">
          <div className="d-flex flex-column">
            <div className="fw-bold">
              {post.topic != null ? (
                post.topic
              ) : (
                <>
                  {post.firstname} {post.lastname}
                </>
              )}
            </div>
            <div className="d-flex gap-3">
              <div
                style={{
                  fontSize: "0.9" + "rem",
                  color: "#b6b6b6",
                }}
              >
                {post.topic != null
                  ? post.firstname + " " + post.lastname
                  : "@" + post.username}
              </div>
              <span className="d-flex">
                <div
                  // className="fw-bold"
                  style={{ fontSize: "0.9" + "rem" }}
                >
                  - {formatDate(post.createdAt)}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="quote-title fw-bold fs-4 ms-2">{post.title}</div>
        <div className="quote-body ms-2">
          <div>{post.quote}</div>
          <div className="d-flex gap-2 mt-3">
            <LazyLoadImage
              src={
                post.thumbnail != null
                  ? post.thumbnail
                  : "https://placehold.co/40x60"
              }
              width="40"
              height="60"
              alt=""
            />
            <div className="book-details">
              <div
                className="book-title fw-bold"
                style={{ fontSize: 14 + "px" }}
              >
                {post.truncated_title}
              </div>
              <div
                className="book-details-inner"
                style={{
                  color: "#b6b6b6",
                  fontSize: 13 + "px",
                }}
              >
                <div className="d-flex gap-1">
                  <div className="published-date">{post.published_date}</div>
                  <span className="dot-separator">&#183;</span>
                  <div className="publisher">{post.publishers}</div>
                  <span className="dot-separator">&#183;</span>
                  <div className="authors">{post.authors}</div>
                </div>
                <div className="page">Page {post.page}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="quote-footer d-flex">
          <Link
            className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
            to={`/posts/quote/${post.id}`}
            style={{ width: 55 + "px", height: 30 + "px" }}
            title="Reply"
          >
            <FaComment style={{ fill: "#b6b6b6" }} />
            <span style={{ color: "#b6b6b6" }}>{post.comment_count}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostQuote;
