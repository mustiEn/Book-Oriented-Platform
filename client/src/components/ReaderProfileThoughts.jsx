import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import moment from "moment";
import { FaComment } from "react-icons/fa6";

const ReaderProfileThoughts = () => {
  const { thoughts } = useLoaderData();

  console.log(thoughts);

  return (
    <>
      <ul id="thoughts" className="d-flex flex-column gap-3">
        {thoughts[0].id != null ? (
          thoughts.map((thought) => {
            return (
              <li key={thought.id} className="thought p-3">
                {thought.Topic != null ? (
                  <div
                    className="topic-userPp position-relative float-start"
                    style={{ width: 55 + "px" }}
                  >
                    <img
                      src={`/Topics/${thought.Topic}`}
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
                  <div className="thought-header gap-2 ms-2">
                    <div className="d-flex flex-column">
                      <div className="fw-bold">
                        {thought.topic != null ? (
                          thought.topic
                        ) : (
                          <>
                            {thought.firstname} {thought.lastname}
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
                          {thought.Topic != null
                            ? thought.firstname + " " + thought.lastname
                            : "@" + thought.username}
                        </div>
                        <span className="d-flex">
                          <div
                            // className="fw-bold"
                            style={{ fontSize: "0.9" + "rem" }}
                          >
                            - {moment(thought.createdAt).fromNow(false)}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="thought-body ms-2">
                    <div className="thought-title fw-bold fs-4">
                      {thought.title}
                    </div>
                    <div>{thought.thought}</div>
                    {/* <div className="d-flex gap-2 mt-3">
                      <img
                        src={
                          thought.thumbnail != null
                            ? thought.thumbnail
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
                          {thought.truncated_title}
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
                              {thought.published_date}
                            </div>
                            <span className="dot-separator">&#183;</span>
                            <div className="publisher">
                              {thought.publishers}
                            </div>
                            <span className="dot-separator">&#183;</span>
                            <div className="authors">{thought.authors_}</div>
                          </div>
                          <div className="people-read">
                            {thought.people_read} people read this
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="thought-footer d-flex">
                    <Link
                      className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
                      to={`/thought/${thought.id}`}
                      style={{ width: 55 + "px", height: 30 + "px" }}
                      title="Reply"
                    >
                      <FaComment style={{ fill: "#b6b6b6" }} />
                      <span style={{ color: "#b6b6b6" }}>
                        {thought.comment_count}
                      </span>
                    </Link>
                  </div>
                </div>
                <hr />
              </li>
            );
          })
        ) : (
          <div>No thoughts found</div>
        )}
      </ul>
    </>
  );
};

export default ReaderProfileThoughts;
