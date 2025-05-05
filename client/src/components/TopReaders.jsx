import React from "react";
import { useLoaderData } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuid } from "uuid";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "../css/explore_general.css";
import { IoMdStar } from "react-icons/io";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";

const TopReaders = ({ readers }) => {
  const [bookWorms, bookWormsPremium, topQuoters, topReviewers] = readers;

  console.log(readers);

  return (
    <>
      <div className="px-2">
        <div className="my-4">
          <div className="h6">Book Worms</div>
          {bookWorms.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {bookWorms.map((bookWorm) => (
                <SwiperSlide
                  key={bookWorm.id}
                  className="rounded-3"
                  style={{
                    backgroundColor: "#c6cacc14",
                    // width: "80%",
                  }}
                >
                  <a
                    href={`/${encodeURIComponent(bookWorm.username)}`}
                    className="d-flex flex-column align-items-center"
                  >
                    <img
                      src={
                        bookWorm.profile_photo == null
                          ? "https://placehold.co/100x100"
                          : `/Pps_and_Bgs/${bookWorm.profile_photo}`
                      }
                      className="rounded-circle mt-3"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="d-flex align-items-center flex-column align-items-center my-2">
                      <div
                        className="d-flex fw-bold gap-1"
                        title={bookWorm.firstname + " " + bookWorm.lastname}
                        style={{ fontSize: 14 + "px" }}
                      >
                        {`${bookWorm.firstname} ${bookWorm.lastname}`.length >
                        13
                          ? `${bookWorm.firstname} ${bookWorm.lastname}`.slice(
                              0,
                              13
                            ) + "..."
                          : `${bookWorm.firstname} ${bookWorm.lastname}`}
                        {bookWorm.customer_id && (
                          <IoMdStar
                            style={{ fill: "#45aceb", fontSize: 18 + "px" }}
                          />
                        )}
                      </div>
                      <div
                        className="text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        @{bookWorm.username}
                      </div>
                    </div>
                    <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                      {bookWorm.books_read} books read
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div className="my-4">
          <div className="h6">Book Worms+</div>
          {bookWormsPremium.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {bookWormsPremium.map((bookWorm) => (
                <SwiperSlide
                  key={bookWorm.id}
                  className="rounded-3"
                  style={{
                    backgroundColor: "#c6cacc14",
                    // width: "80%",
                  }}
                >
                  <a
                    href={`/${encodeURIComponent(bookWorm.username)}`}
                    className="d-flex flex-column align-items-center"
                  >
                    <img
                      src={
                        bookWorm.profile_photo == null
                          ? "https://placehold.co/100x100"
                          : `/Pps_and_Bgs/${bookWorm.profile_photo}`
                      }
                      className="rounded-circle mt-3"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="d-flex align-items-center flex-column align-items-center my-2">
                      <div
                        className="d-flex fw-bold gap-1"
                        title={bookWorm.firstname + " " + bookWorm.lastname}
                        style={{ fontSize: 14 + "px" }}
                      >
                        {`${bookWorm.firstname} ${bookWorm.lastname}`.length >
                        13
                          ? `${bookWorm.firstname} ${bookWorm.lastname}`.slice(
                              0,
                              13
                            ) + "..."
                          : `${bookWorm.firstname} ${bookWorm.lastname}`}
                        <IoMdStar
                          style={{ fill: "#45aceb", fontSize: 18 + "px" }}
                        />
                      </div>
                      <div
                        className="text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        @{bookWorm.username}
                      </div>
                    </div>
                    <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                      {bookWorm.books_read} books read
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div className="my-4">
          <div className="h6">Top Quoters</div>
          {topQuoters.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {topQuoters.map((bookWorm) => (
                <SwiperSlide
                  key={bookWorm.id}
                  className="rounded-3"
                  style={{
                    backgroundColor: "#c6cacc14",
                    // width: "80%",
                  }}
                >
                  <a
                    href={`/${encodeURIComponent(bookWorm.username)}`}
                    className="d-flex flex-column align-items-center"
                  >
                    <img
                      src={
                        bookWorm.profile_photo == null
                          ? "https://placehold.co/100x100"
                          : `/Pps_and_Bgs/${bookWorm.profile_photo}`
                      }
                      className="rounded-circle mt-3"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="d-flex align-items-center flex-column align-items-center my-2">
                      <div
                        className="d-flex fw-bold gap-1"
                        title={bookWorm.firstname + " " + bookWorm.lastname}
                        style={{ fontSize: 14 + "px" }}
                      >
                        {`${bookWorm.firstname} ${bookWorm.lastname}`.length >
                        13
                          ? `${bookWorm.firstname} ${bookWorm.lastname}`.slice(
                              0,
                              13
                            ) + "..."
                          : `${bookWorm.firstname} ${bookWorm.lastname}`}
                        {bookWorm.customer_id && (
                          <IoMdStar
                            style={{ fill: "#45aceb", fontSize: 18 + "px" }}
                          />
                        )}
                      </div>
                      <div
                        className="text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        @{bookWorm.username}
                      </div>
                    </div>
                    <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                      {bookWorm.quote_count} quotes
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div>No data found</div>
          )}
        </div>
        <div className="my-4">
          <div className="h6">Top Reviewers</div>
          {topReviewers.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={45}
              slidesPerView="auto"
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
            >
              {topReviewers.map((bookWorm) => (
                <SwiperSlide
                  key={bookWorm.id}
                  className="rounded-3"
                  style={{
                    backgroundColor: "#c6cacc14",
                    // width: "80%",
                  }}
                >
                  <a
                    href={`/${encodeURIComponent(bookWorm.username)}`}
                    className="d-flex flex-column align-items-center"
                  >
                    <img
                      src={
                        bookWorm.profile_photo == null
                          ? "https://placehold.co/100x100"
                          : `/Pps_and_Bgs/${bookWorm.profile_photo}`
                      }
                      className="rounded-circle mt-3"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="d-flex flex-column align-items-center my-2">
                      <div
                        className="d-flex align-items-center fw-bold gap-1"
                        title={bookWorm.firstname + " " + bookWorm.lastname}
                        style={{ fontSize: 14 + "px" }}
                      >
                        {`${bookWorm.firstname} ${bookWorm.lastname}`.length >
                        13
                          ? `${bookWorm.firstname} ${bookWorm.lastname}`.slice(
                              0,
                              13
                            ) + "..."
                          : `${bookWorm.firstname} ${bookWorm.lastname}`}
                        {bookWorm.customer_id && (
                          <IoMdStar
                            style={{ fill: "#45aceb", fontSize: 18 + "px" }}
                          />
                        )}
                      </div>
                      <div
                        className="text-pale"
                        style={{ fontSize: 13 + "px" }}
                      >
                        @{bookWorm.username}
                      </div>
                    </div>
                    <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                      {bookWorm.review_count} reviews
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

export default TopReaders;
