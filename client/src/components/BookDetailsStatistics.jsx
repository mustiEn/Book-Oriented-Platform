import React, { useState } from "react";
import {
  FaBookOpenReader,
  FaHeart,
  FaEye,
  FaCommentDots,
  FaPerson,
  FaPersonDress,
  FaStar,
} from "react-icons/fa6";
import {
  NavLink,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";
import ProgressBar from "react-bootstrap/ProgressBar";
import slugify from "react-slugify";
import "../css/book_details_statistics.css";

const BookDetailsStatistics = () => {
  const bookStatisticsData = useLoaderData();
  const data = useOutletContext();
  return (
    <>
      <div className="fw-bold fs-5">Book Statistics</div>
      <div
        className="book-statistics d-flex flex-wrap justify-content-evenly align-content-around my-4"
        style={{ height: "225" + "px" }}
      >
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${data.id}/readers?q=Read`}
        >
          <FaBookOpenReader className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.read_}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Read
            </span>
          </div>
        </NavLink>
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${
            data.id
          }/readers?q=Currently-reading`}
        >
          <FaBookOpenReader className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.currently_reading}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Currently reading
            </span>
          </div>
        </NavLink>
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${data.id}/readers?q=Want-to-read`}
        >
          <FaBookOpenReader className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.want_to_read}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Want to read
            </span>
          </div>
        </NavLink>
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${
            data.id
          }/readers?q=Did-not-finish`}
        >
          <FaBookOpenReader className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.did_not_finish}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Did not finish
            </span>
          </div>
        </NavLink>
        <div
          className="d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3"
          style={{ width: "185" + "px" }}
        >
          <FaEye className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.views}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Views
            </span>
          </div>
        </div>
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${data.id}/readers?q=Liked`}
        >
          <FaHeart className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.likes}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Likes
            </span>
          </div>
        </NavLink>
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${data.id}/reviews`}
        >
          <FaCommentDots className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.reviews}
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              Reviews
            </span>
          </div>
        </NavLink>
        <NavLink
          className="statistic d-flex text-decoration-none align-items-baseline gap-3 p-1 ps-3 rounded-3"
          to={`/book/${slugify(data.title)}/${data.id}/reviews`}
        >
          <FaStar className="text-white fs-5" />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5 text-white">
              {bookStatisticsData.bookStatistics.rate}/5
            </span>
            <span style={{ color: "#a79f95", height: "max-content" }}>
              {bookStatisticsData.bookStatistics.people_rated} People
            </span>
          </div>
        </NavLink>
      </div>
      <hr />
      <div className="fw-bold fs-5">Reader Profile of the Book</div>
      <div className="reader-profile d-flex align-items-center gap-5 my-4">
        <div className="genders d-flex flex-column">
          <div className="female-box d-flex align-items-center gap-3">
            <FaPersonDress className="fs-1" />
            <div className="d-flex flex-column">
              <span className="fs-5">Female</span>
              <span style={{ color: "#a79f95" }}>
                {bookStatisticsData.bookStatistics.female_percentage}%
              </span>
            </div>
          </div>
          <div className="male-box d-flex align-items-center gap-3">
            <FaPerson className="fs-1" />
            <div className="d-flex flex-column">
              <span className="fs-5">Male</span>
              <span style={{ color: "#a79f95" }}>
                {bookStatisticsData.bookStatistics.male_percentage}%
              </span>
            </div>
          </div>
        </div>
        <div className="age-range flex-grow-1">
          {Object.entries(bookStatisticsData.readerAgeRange).map(
            ([key, val], index) => {
              return (
                <div
                  className="d-flex align-items-center gap-3 justify-content-end"
                  key={index}
                >
                  <div style={{ fontSize: "10" + "px" }}>{key} age</div>
                  <ProgressBar
                    now={val}
                    style={{ height: "8" + "px", width: "85" + "%" }}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default BookDetailsStatistics;
