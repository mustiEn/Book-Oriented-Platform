import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { v4 as uuid } from "uuid";

const TopBooks = ({ books }) => {
  const [
    mostRead,
    mostLiked,
    highestRated,
    mostReadLastMonth,
    mostReadLastYear,
  ] = books;

  console.log(books);

  return (
    <>
      <div className="d-flex flex-column gap-3">
        <div>
          <h5 className="my-2">The Most Read Books Last Month</h5>
          {mostReadLastMonth.length != 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {mostReadLastMonth.map((book) => (
                <SwiperSlide key={uuid()}>
                  <a
                    href={`/book/${encodeURIComponent(book.title)}/${book.id}`}
                    className="d-flex flex-column"
                  >
                    <img
                      src={
                        book.thumbnail == null
                          ? "https://placehold.co/120x180"
                          : book.thumbnail
                      }
                      className="rounded-3"
                      width={120}
                      height={180}
                      alt=""
                    />
                    <div className="my-2">
                      <div
                        className="fw-bold"
                        style={{ fontSize: 14 + "px" }}
                        title={book.title}
                      >
                        {book.truncatedTitle}
                      </div>
                      <div
                        className="d-flex text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        {book.rate != null ? (
                          <>
                            <div className="d-flex align-items-center gap-1">
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="rgb(182, 182, 182)"
                                key={uuid()}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                              </svg>
                              {book.rate}
                            </div>
                            <span className="dot-separator">&#183;</span>
                          </>
                        ) : (
                          ""
                        )}
                        <div>{book.likes} likes</div>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div>
          <h5 className="my-2">The Most Read Books Last Year</h5>
          {mostReadLastYear.length != 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {mostReadLastYear.map((book) => (
                <SwiperSlide key={uuid()}>
                  <a
                    href={`/book/${encodeURIComponent(book.title)}/${book.id}`}
                    className="d-flex flex-column"
                  >
                    <img
                      src={
                        book.thumbnail == null
                          ? "https://placehold.co/120x180"
                          : book.thumbnail
                      }
                      className="rounded-3"
                      width={120}
                      height={180}
                      alt=""
                    />
                    <div className="my-2">
                      <div
                        className="fw-bold"
                        style={{ fontSize: 14 + "px" }}
                        title={book.title}
                      >
                        {book.truncatedTitle}
                      </div>
                      <div
                        className="d-flex text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        {book.rate != null ? (
                          <>
                            <div className="d-flex align-items-center gap-1">
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="rgb(182, 182, 182)"
                                key={uuid()}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                              </svg>
                              {book.rate}
                            </div>
                            <span className="dot-separator">&#183;</span>
                          </>
                        ) : (
                          ""
                        )}
                        <div>{book.likes} likes</div>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div>
          <h5 className="my-2">The Highest Rated Books</h5>
          {highestRated.length != 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {highestRated.map((book) => (
                <SwiperSlide key={uuid()}>
                  <a
                    href={`/book/${encodeURIComponent(book.title)}/${book.id}`}
                    className="d-flex flex-column"
                  >
                    <img
                      src={
                        book.thumbnail == null
                          ? "https://placehold.co/120x180"
                          : book.thumbnail
                      }
                      className="rounded-3"
                      width={120}
                      height={180}
                      alt=""
                    />
                    <div className="my-2">
                      <div
                        className="fw-bold"
                        style={{ fontSize: 14 + "px" }}
                        title={book.title}
                      >
                        {book.truncatedTitle}
                      </div>
                      <div
                        className="d-flex text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        {book.rate != null ? (
                          <>
                            <div className="d-flex align-items-center gap-1">
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="rgb(182, 182, 182)"
                                key={uuid()}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                              </svg>
                              {book.rate}
                            </div>
                            <span className="dot-separator">&#183;</span>
                          </>
                        ) : (
                          ""
                        )}
                        <div>{book.likes} likes</div>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div>
          <h5 className="my-2">The Most Read Books</h5>
          {mostRead.length != 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {mostRead.map((book) => (
                <SwiperSlide key={uuid()}>
                  <a
                    href={`/book/${encodeURIComponent(book.title)}/${book.id}`}
                    className="d-flex flex-column"
                  >
                    <img
                      src={
                        book.thumbnail == null
                          ? "https://placehold.co/120x180"
                          : book.thumbnail
                      }
                      className="rounded-3"
                      width={120}
                      height={180}
                      alt=""
                    />
                    <div className="my-2">
                      <div
                        className="fw-bold"
                        style={{ fontSize: 14 + "px" }}
                        title={book.title}
                      >
                        {book.truncatedTitle}
                      </div>
                      <div
                        className="d-flex text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        {book.rate != null ? (
                          <>
                            <div className="d-flex align-items-center gap-1">
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="rgb(182, 182, 182)"
                                key={uuid()}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                              </svg>
                              {book.rate}
                            </div>
                            <span className="dot-separator">&#183;</span>
                          </>
                        ) : (
                          ""
                        )}
                        <div>{book.likes} likes</div>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div>
          <h5 className="my-2">The Most Liked Books</h5>
          {mostLiked.length != 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {mostLiked.map((book) => (
                <SwiperSlide key={uuid()}>
                  <a
                    href={`/book/${encodeURIComponent(book.title)}/${book.id}`}
                    className="d-flex flex-column"
                  >
                    <img
                      src={
                        book.thumbnail == null
                          ? "https://placehold.co/120x180"
                          : book.thumbnail
                      }
                      className="rounded-3"
                      width={120}
                      height={180}
                      alt=""
                    />
                    <div className="my-2">
                      <div
                        className="fw-bold"
                        style={{ fontSize: 14 + "px" }}
                        title={book.title}
                      >
                        {book.truncatedTitle}
                      </div>
                      <div
                        className="d-flex text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        {book.rate != null ? (
                          <>
                            <div className="d-flex align-items-center gap-1">
                              <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 32 32"
                                fill="rgb(182, 182, 182)"
                                key={uuid()}
                              >
                                <path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"></path>
                              </svg>
                              {book.rate}
                            </div>
                            <span className="dot-separator">&#183;</span>
                          </>
                        ) : (
                          ""
                        )}
                        <div>{book.likes} likes</div>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopBooks;
