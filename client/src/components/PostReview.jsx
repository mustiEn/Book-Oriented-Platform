import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { FaArrowLeft, FaComment, FaBookmark, FaHeart } from "react-icons/fa6";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const PostReview = ({ data }) => {
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
          <img
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
        <div className="review-header d-flex gap-2 ms-2">
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
        <div
          className="reader-book-statistics d-flex gap-2 ms-2"
          style={{ fontSize: 13 + "px" }}
        >
          {post.reading_state == "Currently reading" ? (
            <div>
              {post.page_number} pages
              <span className="dot-separator">&#183;</span>
            </div>
          ) : post.reading_state != null ? (
            <div>
              {post.reading_state}
              <span className="dot-separator">&#183;</span>
            </div>
          ) : (
            ""
          )}

          {post.is_liked != 0 ? <div>Liked the book</div> : ""}

          <div className="d-flex align-items-center">
            <span className="dot-separator">&#183;</span>
            {post.rating != null
              ? Array.from({ length: 5 }, (_, i) =>
                  i <= post.rating ? (
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 32 32"
                      fill="gold"
                      key={i}
                    >
                      <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                    </svg>
                  ) : (
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 32 32"
                      fill="gold"
                      key={i}
                    >
                      <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path>
                    </svg>
                  )
                )
              : "Not rated yet"}
          </div>
        </div>
        <div className="review-title fw-bold fs-4 ms-2">{post.title}</div>
        <div className="review-body ms-2">
          <div>{post.review}</div>
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
                <div className="people-read">
                  {post.people_read} people read this
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="review-footer d-flex">
          <Link
            className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
            to={`/posts/review/${post.id}`}
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

export default PostReview;
