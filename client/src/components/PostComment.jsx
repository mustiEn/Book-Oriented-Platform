import React from "react";

const PostComment = ({ data }) => {
  const { post } = data;
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
            {post.User.firstname} {post.User.lastname}
          </div>
          <div className="username d-flex gap-3">
            <div
              style={{
                fontSize: "0.9" + "rem",
                color: "rgb(186, 180, 171)",
              }}
            >
              @{post.User.username}
            </div>
            <span className="d-flex">
              <div style={{ fontSize: "0.9" + "rem" }}>
                - {moment(post.createdAt).fromNow(false)}
              </div>
            </span>
          </div>
        </div>
        <div className="post-body ms-2">{post.comment}</div>
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

export default PostComment;
