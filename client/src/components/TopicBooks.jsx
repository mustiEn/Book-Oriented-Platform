import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { FaCaretDown, FaLock } from "react-icons/fa6";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-hot-toast";
import ReaderBookModalDetails from "./ReaderBookModalDetails";
import Spinner from "../spinner/Spinner";

const TopicBooks = () => {
  const { books, bookPageCounts } = useLoaderData();
  const navigation = useNavigation();

  const [modalState, setModalState] = useState({
    isClicked: false,
    show: false,
    bookId: null,
    readingState: null,
    prevReadingState: null,
    privateNote: null,
    startingDate: null,
    finishingDate: null,
    pageNumber: null,
  });

  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      setPending(true);
    } else {
      setPending(false);
    }
  }, [navigation.state]);

  return (
    <>
      <ReaderBookModalDetails
        modalProps={[
          bookPageCounts,
          pending,
          setPending,
          modalState,
          setModalState,
        ]}
      />
      <ul className="d-flex flex-column gap-3 px-2">
        {books.map((book, i) => (
          <li key={book.id} className="d-flex align-items-center gap-2">
            <div>{i + 1}</div>
            <div className="d-flex align-items-center flex-grow-1 gap-2">
              <Link to={`/book/${encodeURIComponent(book.title)}/${book.id}`}>
                <img
                  src={
                    book.thumbnail
                      ? book.thumbnail
                      : "https://placehold.co/60x90"
                  }
                  width={60}
                  height={90}
                  alt=""
                />
              </Link>
              <div className="d-felx flex-column gap-2">
                <Link
                  to={`/book/${encodeURIComponent(book.title)}/${book.id}`}
                  title={book.title}
                  className="fw-bold"
                >
                  {book.truncatedTitle}
                </Link>
                <div
                  title={book.authors}
                  className="text-pale mt-2"
                  style={{ fontSize: 14 + "px" }}
                >
                  {book.authors.length > 40
                    ? book.authors.slice(0, 40) + "..."
                    : book.authors}
                </div>
                <div
                  className="d-flex text-pale mt-2"
                  style={{ fontSize: 13 + "px" }}
                >
                  <div className="d-flex align-items-center gap-1">
                    {book.overallRating == null ? (
                      "No overall rating found"
                    ) : (
                      <>
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 32 32"
                          fill="#b6b6b6"
                          key={i}
                        >
                          <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path>
                        </svg>
                        {book.overallRating}/5
                      </>
                    )}
                  </div>
                  <span className="dot-separator">&#183;</span>
                  <div>{book.peopleRead} people read</div>
                </div>
              </div>
              <Button
                variant="outline-light"
                size="sm"
                className="ms-auto"
                onClick={() => {
                  setPending(true);
                  setModalState((prevState) => ({
                    ...prevState,
                    isClicked: true,
                    bookId: book.id,
                  }));
                }}
              >
                +&nbsp;Add to my booklist&nbsp;
                <FaCaretDown />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <Spinner pendingVal={pending} />
    </>
  );
};

export default TopicBooks;
