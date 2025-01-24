import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaComment, FaBookmark, FaHeart } from "react-icons/fa6";
import {
  useLoaderData,
  useNavigate,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/reader_post_comments.css";
import TextareaAutosize from "react-textarea-autosize";
import PostComment from "./PostComment";
import PostReview from "./PostReview";
import PostQuote from "./PostQuote";
import PostThought from "./PostThought";
import BackNavigation from "./BackNavigation";

const ReaderPostComments = () => {
  let { post, comments, user } = useLoaderData();
  const navigate = useNavigate();
  const [commentList, setCommentList] = useState(comments);
  const { postType, postId } = useParams();
  const [comment, setComment] = useState("");
  const sendComment = async () => {
    try {
      const res = await fetch("/api/send-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
          commentToId: postId,
          postType: postType,
        }),
      });
      const data = await res.json();
      if (!res) throw new Error("Failed to send comment");
      setCommentList(data.comments);
      toast.success("Comment sent");
      setComment("");
      console.log(data);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  const returnPostComponent = () => {
    let comp;
    if (postType == "comment") {
      comp = <PostComment data={post} />;
    } else if (postType == "review") {
      comp = <PostReview data={post} />;
    } else if (postType == "quote") {
      comp = <PostQuote data={post} />;
    } else {
      comp = <PostThought data={post} />;
    }
    return comp;
  };
  post = JSON.parse(post);

  console.log(post, comments);

  useEffect(() => {
    setCommentList(comments);
    console.log(comments);
  }, [comments]);

  return (
    <>
      <BackNavigation innerHtml={"Post"} />
      <div className="post p-3">
        {returnPostComponent()}
        <hr />
      </div>
      {commentList.length > 0 ? (
        <ul
          id="comments"
          className="d-flex flex-column gap-3 p-3"
          style={{ marginBottom: 8 + "rem" }}
        >
          {commentList.map((comment) => {
            return (
              <li key={comment.id} className="comment">
                <img
                  src="https://placehold.co/45x45"
                  alt=""
                  className="userPp rounded-circle float-start me-2"
                />
                <div className="d-flex flex-column gap-2">
                  <div className="comment-header ms-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-official-name fw-bold">
                        {comment.firstname} {comment.lastname}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9" + "rem",
                          color: "rgb(186, 180, 171)",
                        }}
                      >
                        @{comment.username}
                      </div>
                      <div
                        className="d-flex"
                        style={{ fontSize: "0.9" + "rem" }}
                      >
                        - {moment(comment.created_at).fromNow(false)}
                      </div>
                    </div>
                  </div>
                  <div className="comment-body ms-2">
                    <div>{comment.comment}</div>
                  </div>
                  <div className="comment-footer d-flex">
                    <Link
                      className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
                      to={`/comment/${comment.id}`}
                      style={{ width: 55 + "px", height: 30 + "px" }}
                      title="Reply"
                    >
                      <FaComment style={{ fill: "#b6b6b6" }} />
                      <span style={{ color: "#b6b6b6" }}>
                        {comment.comment_count}
                      </span>
                    </Link>
                  </div>
                </div>
                <hr />
              </li>
            );
          })}
        </ul>
      ) : (
        ""
      )}
      <div
        className="position-fixed bottom-0 border-top p-3"
        style={{ width: "inherit", backgroundColor: "#121212d4" }}
      >
        <div className="d-flex justify-content-center align-items-start gap-3">
          <img
            className="rounded-circle"
            src={
              user.profile_photo != null
                ? user.profile_photo
                : "https://placehold.co/45x45"
            }
            alt=""
          />
          <Form
            dark-bs-theme="dark"
            className="d-flex align-items-end gap-3"
            style={{ width: 80 + "%" }}
            onSubmit={(e) => {
              e.preventDefault();
              sendComment();
            }}
          >
            <TextareaAutosize
              className="w-100"
              style={{
                color: "white",
                backgroundColor: "#121212",
                resize: "none",
                border: "none",
                outline: 0,
              }}
              placeholder="Post your reply"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              minRows={2}
              maxRows={10}
            />
            <Button
              size="sm"
              variant="primary"
              disabled={comment == "" ? true : false}
              type="submit"
            >
              Reply
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ReaderPostComments;
