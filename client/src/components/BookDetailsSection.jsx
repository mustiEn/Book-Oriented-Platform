import React, { lazy } from "react";
import {
  NavLink,
  Link,
  useNavigate,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import slugify from "react-slugify";
import {
  FaStar,
  FaArrowUpRightFromSquare,
  FaArrowLeft,
  FaArrowsRotate,
  FaHeart,
} from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Button from "react-bootstrap/Button";
import "../css/book_details_section.css";
import Spinner from "../spinner/Spinner";
import BackNavigation from "./BackNavigation";
import { returnSuspenseLoader } from "../App";

const ReaderBookModalDetails = lazy(() => import("./ReaderBookModalDetails"));

const BookDetailsSection = ({ bookDetails, readerBookInteractionData }) => {
  const bookPageCount = { [bookDetails.id]: bookDetails.page_count };
  const ref = useRef({
    effect1: false,
    effect2: false,
    effect3: false,
    effect4: false,
  });
  const starList = [1, 2, 3, 4, 5];
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
  const [bookState, setBookState] = useState({
    isBookLiked: readerBookInteractionData.is_liked,
    isBookLikedToggler: false,
    isRatingReset: false,
    rate: readerBookInteractionData.rating,
    rateGiven: null,
    ratePrev: readerBookInteractionData.rating,
    rateToggler: false,
  });
  const sendBookLiked = async (isLiked) => {
    const res = await fetch(`/api/set-book-liked/${bookDetails.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isBookLiked: isLiked,
      }),
    });
    if (res.ok) {
      toast.success("Like updated");
      setBookState((prevState) => ({
        ...prevState,
        isBookLiked: isLiked,
      }));
    } else {
      toast.error("Something went wrong");
    }
    setPending(false);
  };
  const sendBookRate = async (rate) => {
    const res = await fetch(`/api/set-book-rate/${bookDetails.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rate: rate,
      }),
    });
    if (res.ok) {
      toast.success("Rate updated");
      setBookState((prevState) => ({
        ...prevState,
        rate: rate,
      }));
    } else {
      toast.error("Something went wrong");
    }
    setPending(false);
  };

  useEffect(() => {
    if (ref.current.effect2) {
      setPending(true);
      const timeout = setTimeout(() => {
        sendBookLiked(!bookState.isBookLiked);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [bookState.isBookLikedToggler]);

  useEffect(() => {
    if (ref.current.effect3) {
      setPending(true);
      const timeout = setTimeout(() => {
        sendBookRate(bookState.rateGiven);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [bookState.rateGiven]);

  return (
    <>
      <BackNavigation innerHtml="Book Details" />
      <Suspense fallback={returnSuspenseLoader()}>
        <ReaderBookModalDetails
          modalProps={[
            bookPageCount,
            pending,
            setPending,
            modalState,
            setModalState,
          ]}
        />
      </Suspense>
      <div id="bookDetails" className="w-100 p-4">
        <div className="book-details-header w-100 d-flex align-items-center gap-3">
          {bookDetails.thumbnail ? (
            <img src={bookDetails.thumbnail} width={80 + "px"} alt="" />
          ) : (
            <div>Image not found</div>
          )}
          <div className="d-flex flex-column">
            <span className="book-title fs-3 ">{bookDetails.title}</span>
            <span className="book-author fs-6 ">{bookDetails.authors}</span>
          </div>
        </div>
        <div className="book-rating my-3">
          <div className="fs-5">Rate this book</div>
          <div className="d-flex align-items-center mt-2 gap-4">
            <ul className="d-flex gap-2">
              {starList.map((star) => {
                return (
                  <li
                    key={star}
                    id={"star-" + star}
                    style={{
                      backgroundColor:
                        bookState.rate == star ? "yellow" : "gray",
                      color: bookState.rate == star ? "black" : "white",
                    }}
                    className="star-box d-flex align-items-center gap-2 rounded-3 p-2"
                    onClick={() => {
                      setBookState((prevState) => ({
                        ...prevState,
                        rateGiven: star,
                      }));
                      ref.current["effect3"] = true;
                    }}
                  >
                    {star}
                    <FaStar />
                  </li>
                );
              })}
            </ul>
            <FaArrowsRotate
              className="fs-4 arrows-rotate"
              style={{
                transform: bookState.isRatingReset
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "0.3s",
              }}
              onMouseEnter={() =>
                setBookState((prevState) => ({
                  ...prevState,
                  isRatingReset: true,
                }))
              }
              onMouseLeave={() =>
                setBookState((prevState) => ({
                  ...prevState,
                  isRatingReset: false,
                }))
              }
              onClick={() => {
                setBookState((prevState) => ({
                  ...prevState,
                  rate: null,
                }));
                ref.current["effect3"] = true;
              }}
            />
          </div>
        </div>
        <div className="w-100 d-flex justify-content-between gap-4">
          <Button
            id="add-to-booklist-btn"
            variant="light"
            className="flex-grow-1"
            onClick={() => {
              setPending(true);
              setModalState((prevState) => ({
                ...prevState,
                isClicked: true,
                bookId: bookDetails.id,
              }));
            }}
          >
            Add to my booklist
          </Button>
          <Button
            id="like-btn"
            className="d-flex align-items-center gap-1"
            variant={bookState.isBookLiked ? "danger" : "light"}
            onClick={() => {
              setBookState((prevState) => ({
                ...prevState,
                isBookLikedToggler: !prevState.isBookLikedToggler,
              }));
              ref.current["effect2"] = true;
            }}
          >
            <FaHeart />
            {bookState.isBookLiked ? <span>Liked</span> : <span>Like</span>}
          </Button>
          {bookDetails.buy_link !== null ? (
            <Link
              // className="btn btn-light d-flex gap-2 align-items-center"
              to={bookDetails.buy_link}
            >
              <Button
                variant="light"
                // onClick={() => navigate(bookDetails.saleInfo.buyLink)} // buraya bak function icine aldim
              >
                Buy <FaArrowUpRightFromSquare />
              </Button>
            </Link>
          ) : (
            ""
          )}
        </div>
        <ul className="d-flex mt-3 gap-2">
          <li id="li-about">
            <NavLink
              to={`/book/${slugify(
                bookDetails.title.replace(/[...,:;]/g, "")
              )}/${bookDetails.id}`}
              className={({ isActive }) =>
                isActive ? "link-light" : "text-decoration-none link-light"
              }
              end
            >
              About
            </NavLink>
          </li>
          <li id="li-reviews">
            <NavLink
              to={`/book/${slugify(
                bookDetails.title.replace(/[...,:;]/g, "")
              )}/${bookDetails.id}/reviews`}
              className={({ isActive }) =>
                isActive ? "link-light" : "text-decoration-none link-light"
              }
            >
              Reviews
            </NavLink>
          </li>
          <li id="li-statistics">
            <NavLink
              to={`/book/${slugify(
                bookDetails.title.replace(/[...,:;]/g, "")
              )}/${bookDetails.id}/statistics`}
              className={({ isActive }) =>
                isActive ? "link-light" : "text-decoration-none link-light"
              }
            >
              Statistics
            </NavLink>
          </li>
          <li id="li-readers">
            <NavLink
              to={`/book/${slugify(
                bookDetails.title.replace(/[...,:;]/g, "")
              )}/${bookDetails.id}/readers`}
              className={({ isActive }) =>
                isActive ? "link-light" : "text-decoration-none link-light"
              }
            >
              Readers
            </NavLink>
          </li>
        </ul>
      </div>
      <Spinner pendingVal={pending} />
    </>
  );
};

export default BookDetailsSection;
