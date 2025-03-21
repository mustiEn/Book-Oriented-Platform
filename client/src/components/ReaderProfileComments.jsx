import React, { useState } from "react";
import { FaComment } from "react-icons/fa6";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import "../css/reader_profile_comments.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "react-bootstrap/esm/Button";
import Spinner from "../spinner/Spinner";

const ReaderProfileComments = () => {
  const { comments } = useLoaderData();
  const { profile: username } = useParams();
  const [items, setItems] = useState(comments);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(5);
  const navigate = useNavigate();
  console.log(comments);

  const fetchMoreData = async () => {
    const response = await fetch(
      `/api/get-reader-comments/${username}/${index}`
    );
    const { comments } = await response.json();
    if (!response.ok) {
      throw new Error(response);
    }
    setItems((prevItems) => [...prevItems, ...comments]);

    comments.length > 0 ? setHasMore(true) : setHasMore(false);
    setIndex(index + 5);
    console.log(response);
  };
  return (
    <>
      <ul>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Spinner />}
        >
          {items.map((comment, i) => {
            return (
              <li key={i} className="comment p-3">
                <div style={{ backgroundColor: "#121212" }}>
                  <img
                    src="https://placehold.co/45x45"
                    alt=""
                    className="userPp rounded-circle float-start me-2"
                  />
                  <div className="d-flex flex-column gap-2">
                    <div className="comment-header ms-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="user-official-name fw-bold">
                          {comment.commenterFirstname}{" "}
                          {comment.commenterLastname}
                        </div>
                        <div
                          style={{
                            fontSize: "0.9" + "rem",
                            color: "rgb(186, 180, 171)",
                          }}
                        >
                          @{comment.commenterUsername}
                        </div>
                        <div
                          className="d-flex"
                          style={{ fontSize: "0.9" + "rem" }}
                        >
                          - {moment(comment.commentCreated).fromNow(false)}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9" + "rem",
                          color: "rgb(186, 180, 171)",
                        }}
                      >
                        Replying to{" "}
                        <Link
                          to={`/${comment.username}`}
                          className="replying-to text-primary"
                        >
                          @{comment.username}
                        </Link>
                      </div>
                    </div>
                    <div className="comment-body ms-2">
                      <div>{comment.comment}</div>
                    </div>
                    <div className="comment-footer d-flex">
                      <Link
                        className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-primary"
                        to={`comment/${comment.id}`}
                        style={{ width: 55 + "px", height: 30 + "px" }}
                        title="Reply"
                      >
                        <FaComment style={{ fill: "#b6b6b6" }} />
                        <span style={{ color: "#b6b6b6" }}>
                          {comment.commentCount}
                        </span>
                      </Link>
                      <Button
                        className="ms-auto"
                        style={{
                          fontSize: "0.9" + "rem",
                        }}
                        onClick={() => {
                          navigate(
                            `/${comment.postType}/${comment.commentToId}`
                          );
                        }}
                      >
                        See the original post
                      </Button>
                    </div>
                  </div>
                </div>

                <hr />
              </li>
            );
          })}
        </InfiniteScroll>
      </ul>
    </>
  );
};

export default ReaderProfileComments;
