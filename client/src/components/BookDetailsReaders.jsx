import React from "react";
import {
  useSearchParams,
  useLoaderData,
  NavLink,
  useOutletContext,
  useLocation,
  Link,
} from "react-router-dom";

const BookDetailsReaders = () => {
  const { readerProfiles } = useLoaderData();
  const location = useLocation();
  const options = [
    "Read",
    "Currently-reading",
    "Want-to-read",
    "Did-not-finish",
    "Liked",
  ];

  return (
    <>
      <ul className="d-flex gap-2">
        {options.map((option, index) => {
          return (
            <li key={index}>
              <NavLink
                id={option}
                className={({ isActive }) =>
                  isActive && location.search === `?q=${option}`
                    ? "btn btn-danger"
                    : "btn btn-primary"
                }
                to={`${location.pathname}${
                  option != "Read" ? `?q=${option}` : ""
                }`}
              >
                {option.replaceAll("-", " ")}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="readers">
        {readerProfiles.length == 0 ? (
          <div>No Readers Found</div>
        ) : (
          <ul>
            {readerProfiles.map((reader) => {
              return (
                <li
                  key={reader.userId}
                  className="d-flex align-items-center gap-3"
                >
                  <img
                    src="https://placehold.co/70x70"
                    alt=""
                    className="userPP rounded-circle"
                  />
                  <div className="d-flex flex-column">
                    <Link
                      to={`/profile/${reader.username}`}
                      className="user-official-name fw-bold"
                    >
                      {reader.firstname} {reader.lastname}
                    </Link>
                    <div
                      className="fst-italic"
                      style={{ fontSize: "0.9" + "rem" }}
                    >
                      @{reader.username}
                    </div>
                    <div className="mt-2">{reader.book_read} books read</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default BookDetailsReaders;
