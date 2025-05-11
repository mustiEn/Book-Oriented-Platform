import React, { useState } from "react";
import { FaComment } from "react-icons/fa6";
import { Link, useLoaderData, useParams } from "react-router-dom";
import "../css/reader_profile_comments.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "react-bootstrap/esm/Button";
import Spinner from "../spinner/Spinner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const ReaderProfileComments = () => {
  const { comments } = useLoaderData();
  const { profile: username } = useParams();
  const [items, setItems] = useState(comments);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(5);
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
          {items.length > 0 ? (
            items.map((comment, i) => {
              return (
                <li key={i} className="comment p-3">
                  <div
                    style={{ backgroundColor: "#121212" }}
                    className=" rounded-3 p-2"
                  >
                    <img
                      src="https://placehold.co/45x45"
                      alt=""
                      className="userPp rounded-circle float-start me-2"
                    />
                    <div className="d-flex flex-column gap-2">
                      <div className="comment-header ms-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-official-name fw-bold">
                            {comment.sender_firstname} {comment.sender_lastname}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9" + "rem",
                              color: "rgb(186, 180, 171)",
                            }}
                          >
                            @{comment.sender_username}
                          </div>
                          <div
                            className="d-flex"
                            style={{ fontSize: "0.9" + "rem" }}
                          >
                            - {formatDate(comment.createdAt)}
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
                            to={`/profile/${comment.receiver_username}`}
                            className="replying-to text-primary"
                          >
                            @{comment.receiver_username}
                          </Link>
                        </div>
                      </div>
                      <div className="comment-body ms-2">
                        <div>{comment.comment}</div>
                      </div>
                      <div className="comment-footer d-flex">
                        <Link
                          className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-primary"
                          to={`/posts/comment/${comment.id}`}
                          style={{ width: 55 + "px", height: 30 + "px" }}
                          title="Reply"
                        >
                          <FaComment style={{ fill: "#b6b6b6" }} />
                          <span style={{ color: "#b6b6b6" }}>
                            {comment.comment_count}
                          </span>
                        </Link>
                        <Button
                          className="ms-auto"
                          style={{
                            fontSize: "0.9" + "rem",
                          }}
                          variant="outline-light"
                          as={Link}
                          to={`/posts/${comment.post_type}/${comment.commentToId}`}
                        >
                          See the original post
                        </Button>
                      </div>
                    </div>
                  </div>

                  <hr />
                </li>
              );
            })
          ) : (
            <div>No comments found</div>
          )}
        </InfiniteScroll>
      </ul>
    </>
  );
};

export default ReaderProfileComments;
