import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import { FaArrowLeft, FaComment, FaBookmark, FaHeart } from "react-icons/fa6";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const PostThought = ({ data }) => {
  const post = data;
  const now = dayjs();
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
      <img
        src="https://placehold.co/45x45"
        alt=""
        className="userPp rounded-circle float-start me-2"
      />
      <div className="d-flex flex-column gap-2">
        <div className="thought-header gap-2 ms-2">
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
                  color: "rgb(186, 180, 171)",
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
        <div className="thought-body ms-2">
          <div className="thought-title fw-bold fs-4">{post.title}</div>
          <div>{post.thought}</div>
          {/* <div className="d-flex gap-2 mt-3">
            <img
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
                color: "rgb(186, 180, 171)",
                fontSize: 13 + "px",
                }}
            >
                <div className="d-flex gap-1">
                <div className="published-date">
                    {post.published_date}
                </div>
                <span className="dot-separator">&#183;</span>
                <div className="publisher">
                    {post.publishers}
                </div>
                <span className="dot-separator">&#183;</span>
                <div className="authors">{post.authors_}</div>
                </div>
                <div className="people-read">
                {post.people_read} people read this
                </div>
            </div>
            </div>
        </div> */}
        </div>
        <div className="post-footer d-flex">
          <div
            className="comment rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
            // to={`/${postType}/${post.id}`}
            style={{ width: 50 + "px", height: 30 + "px" }}
            title="Like"
          >
            <FaHeart style={{ fill: "#b6b6b6" }} />
            <span style={{ color: "#b6b6b6" }}>2</span>
          </div>
          <div
            className="comment rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
            // to={`/${postType}/${post.id}`}
            style={{ width: 50 + "px", height: 30 + "px" }}
            title="Bookmark"
          >
            <FaBookmark style={{ fill: "#b6b6b6" }} />
            <span style={{ color: "#b6b6b6" }}>2</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostThought;
