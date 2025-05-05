import React from "react";
import { useLoaderData } from "react-router";
import moment from "moment";
import ProgressBar from "react-bootstrap/ProgressBar";
import { v4 as uuid } from "uuid";

const BookDetailsReviews = () => {
  const reviewsAndRatingData = useLoaderData();
  console.log(reviewsAndRatingData);

  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <div className="fw-bold fs-5">Rate</div>
        <div id="rating" className="d-flex justify-content-between mb-5">
          <div className="d-flex flex-column align-items-center">
            <span className="fw-semibold" style={{ fontSize: 45 + "px" }}>
              {reviewsAndRatingData.totalRating[0].rate}
            </span>
            <span
              style={{
                color: "#bcb8b0",
                marginTop: -0.5 + "rem",
                letterSpacing: 1 + "px",
                fontSize: 13 + "px",
              }}
            >
              out of 5
            </span>
          </div>
          <div
            id="peoplePerRate"
            className="d-flex flex-column-reverse align-items-end"
            style={{ width: "fit-content", gap: 2 + "px" }}
          >
            <div style={{ fontSize: "13" + "px", color: "#bcb8b0" }}>
              {reviewsAndRatingData.totalRating[0].total_people_rated} People -{" "}
              {reviewsAndRatingData.reviews.length} Reviews
            </div>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                className="d-flex align-items-center gap-3 justify-content-end"
                key={i}
              >
                <div style={{ fontSize: "10" + "px" }} className="d-flex">
                  {Array.from({ length: i + 1 }, (_, x) => (
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 32 32"
                      fill="gold"
                      key={uuid()}
                    >
                      <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                    </svg>
                  ))}
                </div>
                <ProgressBar
                  now={
                    reviewsAndRatingData.ratingsMap[i + 1] == undefined
                      ? 0
                      : reviewsAndRatingData.ratingsMap[i + 1]
                  }
                  style={{ height: "8" + "px", width: "250" + "px" }}
                />
              </div>
            ))}
          </div>
        </div>
        <div id="reviews" className="d-flex flex-column gap-3">
          {reviewsAndRatingData.reviews.length > 0 ? (
            reviewsAndRatingData.reviews.map((review) => {
              return (
                <div
                  key={review.id}
                  className="review d-flex flex-column gap-2"
                >
                  <div className="review-header d-flex gap-2">
                    <img
                      src="https://placehold.co/50x50"
                      alt=""
                      className="userPP rounded-circle"
                    />
                    <div className="d-flex flex-column">
                      <div className="user-official-name fw-bold">
                        {review.firstname} {review.lastname}
                      </div>
                      <div className="username d-flex gap-3">
                        <div
                          className="fst-italic"
                          style={{ fontSize: "0.9" + "rem" }}
                        >
                          @{review.username}
                        </div>
                        <span className="d-flex">
                          <div
                            // className="fw-bold"
                            style={{ fontSize: "0.9" + "rem" }}
                          >
                            - {moment(review.created_at).fromNow(false)}
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="reader-book-statistics d-flex gap-2"
                    style={{ fontSize: 13 + "px" }}
                  >
                    {review.reading_state == "Currently reading" ? (
                      <div>
                        <span className="dot-separator">&#183;</span>
                        {review.page_number} pages
                      </div>
                    ) : (
                      ""
                    )}
                    {review.reading_state != null ? (
                      <div>
                        <span className="dot-separator">&#183;</span>
                        {review.reading_state}
                      </div>
                    ) : (
                      ""
                    )}

                    {review.is_liked != 0 ? (
                      <div>
                        <span className="dot-separator">&#183;</span>Liked the
                        book
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="d-flex align-items-center">
                      <span className="dot-separator">&#183;</span>
                      {review.rating != null
                        ? Array.from({ length: 5 }, (_, i) =>
                            i <= review.rating ? (
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="gold"
                                key={i}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                              </svg>
                            ) : (
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="gold"
                                key={i}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path>
                              </svg>
                            )
                          )
                        : "Not rated yet"}
                    </div>
                  </div>
                  <div className="review-title fw-bold fs-4">
                    {review.title}
                  </div>
                  <div className="review-body">{review.review}</div>
                  <hr />
                </div>
              );
            })
          ) : (
            <div>No reviews found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookDetailsReviews;
