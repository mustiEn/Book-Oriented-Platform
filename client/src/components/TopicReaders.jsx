import React from "react";
import { Link, useLoaderData } from "react-router-dom";

const TopicReaders = () => {
  const topicReaders = useLoaderData();

  return (
    <>
      {topicReaders.length > 0 ? (
        <ul className="d-flex flex-column gap-3 px-2">
          {topicReaders.map((reader, i) => (
            <li key={reader.id} className="d-flex align-items-center gap-2">
              <div>{i + 1}</div>
              <div className="d-flex align-items-center flex-grow-1 gap-2">
                <Link to={`/profile/${reader.username}`}>
                  <img
                    src={
                      reader.profile_photo
                        ? reader.profile_photo
                        : "https://placehold.co/60"
                    }
                    className="rounded-circle"
                    width={60}
                    height={60}
                    alt=""
                  />
                </Link>
                <div className="d-felx flex-column gap-2">
                  <Link to={`/profile/${reader.username}`} className="fw-bold">
                    {reader.firstname} {reader.lastname}
                  </Link>
                  <div
                    className="text-pale mt-2"
                    style={{ fontSize: 14 + "px" }}
                  >
                    @{reader.username}
                  </div>
                  <div
                    className="d-flex text-pale mt-2"
                    style={{ fontSize: 13 + "px" }}
                  >
                    Read {reader.booksRead} books
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="fs-5 px-3">No readers yet</div>
      )}
    </>
  );
};

export default TopicReaders;
