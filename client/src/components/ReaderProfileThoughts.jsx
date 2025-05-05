import React from "react";
import { Link, useLoaderData } from "react-router";
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
                  </div>
                  <div className="thought-footer d-flex">
                    <Link
                      className="comment-link rounded-3 d-flex gap-2 justify-content-center align-items-center text-decoration-none"
                      to={`/posts/thought/${thought.id}`}
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
