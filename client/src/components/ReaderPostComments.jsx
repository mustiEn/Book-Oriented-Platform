import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoaderData, useParams } from "react-router-dom";
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
  const { post, comments, user } = useLoaderData();
  const [commentCount, setCommentCount] = useState(comments.length);
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
      const { comments } = await res.json();

      if (!res) throw new Error("Failed to send comment");

      setCommentList(comments);
      setCommentCount(comments.length);
      toast.success("Comment sent");
      setComment("");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const returnPostComponent = () => {
    let comp;
    if (postType == "comment") {
      comp = (
        <PostComment isPost={true} commentCount={commentCount} data={post} />
      );
    } else if (postType == "review") {
      comp = <PostReview commentCount={commentCount} data={post} />;
    } else if (postType == "quote") {
      comp = <PostQuote commentCount={commentCount} data={post} />;
    } else {
      comp = <PostThought commentCount={commentCount} data={post} />;
    }
    return comp;
  };

  useEffect(() => {
    setCommentList(comments);
    setCommentCount(comments.length);
  }, [comments]);

  return (
    <>
      <BackNavigation innerHtml={"Post"} />
      <div className="post p-3">
        {returnPostComponent()}
        <hr />
      </div>
      {commentList.length > 0 && (
        <ul
          id="comments"
          className="d-flex flex-column gap-3 p-3"
          style={{ marginBottom: 8 + "rem" }}
        >
          {commentList.map((comment) => {
            return (
              <li key={comment.id} className="comment">
                <PostComment commentCount={commentCount} data={comment} />
                <hr />
              </li>
            );
          })}
        </ul>
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
            data-bs-theme="dark"
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
