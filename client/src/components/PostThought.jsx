import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import { FaComment } from "react-icons/fa6";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const PostThought = ({ data, commentCount = data.comment_count }) => {
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
        src={
          post.profile_photo
            ? `/Pps_and_Bgs/${post.profile_photo}`
            : "https://placehold.co/35"
        }
        alt=""
        width={35}
        height={35}
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
                <div style={{ fontSize: "0.9" + "rem" }}>
                  - {formatDate(post.createdAt)}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="thought-body ms-2">
          <div className="thought-title fw-bold fs-4">{post.title}</div>
          <div>{post.thought}</div>
        </div>
        <div className="post-footer d-flex">
          <Link
            className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
            to={`/posts/thought/${post.id}`}
            style={{ width: 55 + "px", height: 30 + "px" }}
            title="Reply"
          >
            <FaComment style={{ fill: "#b6b6b6" }} />
            <span style={{ color: "#b6b6b6" }}>{commentCount}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostThought;
