import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import { FaBookmark, FaComment, FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const PostComment = ({ data }) => {
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
      <img
        src="https://placehold.co/45x45"
        alt=""
        className="userPp rounded-circle float-start me-2"
      />
      <div className="d-flex flex-column gap-2">
        <div className="post-header d-flex gap-2 ms-2">
          <div className="user-official-name fw-bold">
            {post.firstname} {post.lastname}
          </div>
          <div className="username d-flex gap-3">
            <div
              style={{
                fontSize: "0.9" + "rem",
                color: "rgb(186, 180, 171)",
              }}
            >
              @{post.username}
            </div>
            <span className="d-flex">
              <div style={{ fontSize: "0.9" + "rem" }}>
                - {formatDate(post.createdAt)}
              </div>
            </span>
          </div>
        </div>
        <div className="post-body ms-2">{post.comment}</div>
        <div className="post-footer d-flex">
          <Link
            className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
            to={`/comment/${post.id}`}
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

export default PostComment;
