import React from "react";
import {
  useSearchParams,
  useLoaderData,
  NavLink,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import slugify from "react-slugify";

const BookDetailsReaders = () => {
  const readerProfiles = useLoaderData();
  const data = useOutletContext();
  const location = useLocation();
  const options = [
    "Read",
    "Currently-reading",
    "Want-to-read",
    "Did-not-finish",
    "Liked",
  ];
  console.log(readerProfiles);

  return (
    <>
      <ul className="d-flex gap-2">
        {options.map((option, index) => {
          return (
            <li key={index}>
              <NavLink
                className={({ isActive }) =>
                  isActive && location.search === `?q=${option}`
                    ? "btn btn-danger"
                    : "btn btn-primary"
                }
                to={`/book/${slugify(data.title)}/${data.book_key}/${
                  data.id
                }/readers?q=${option}`}
              >
                {option.replaceAll("-", " ")}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="readers">
        {readerProfiles.readerProfiles.length == 0 ? (
          <div>No Readers Found</div>
        ) : (
          <ul>
            {readerProfiles.readerProfiles.map((reader) => {
              return (
                <li key={reader.id} className="d-flex align-items-center gap-3">
                  <img
                    src="https://placehold.co/70x70"
                    alt=""
                    className="userPP rounded-circle"
                  />
                  <div className="d-flex flex-column">
                    <div className="user-official-name fw-bold">
                      {reader.firstname} {reader.lastname}
                    </div>
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

export const loadReaderProfiles = async ({ request, params }) => {
  const q = new URL(request.url).searchParams.get("q");
  const { bookId } = params;
  console.log(q);
  const response = await fetch(
    `/api/get-reader-profiles/${bookId}/reader?q=${q}`
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(response);
  }
  return data;
};
