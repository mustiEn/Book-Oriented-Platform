import React, { useEffect, useState } from "react";
import {
  useSearchParams,
  useLoaderData,
  useOutletContext,
  useLocation,
  Link,
} from "react-router";
import slugify from "react-slugify";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import "../css/bookshelf_books.css";

const BookshelfBooks = () => {
  const data = useLoaderData();
  const { setIsLoading, setChildDataLength, setAuthors, setCategories } =
    useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q").replaceAll("-", " ");

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setChildDataLength(data.readerBooksMerged.length);
      setAuthors(data.booksPerAuthor);
      setCategories(data.booksPerCategory);
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <div>
        <span className="fw-bold fs-5">{q}</span>{" "}
        {data.readerBooksMerged.length}
        books
      </div>
      <ul className="books">
        {data.readerBooksMerged.length === 0 ? (
          <h1>No books</h1>
        ) : (
          data.readerBooksMerged.map((item, i) => {
            return (
              <li
                className="book d-flex align-items-center gap-3 p-2"
                key={item.id}
                style={{
                  height: 170 + "px",
                }}
              >
                <span>{i + 1}</span>

                {item.thumbnail == null ? (
                  <div style={{ width: 60 + "px" }} className="text-center">
                    Image not found
                  </div>
                ) : (
                  <img src={item.thumbnail} width={60 + "px"} alt="" />
                )}
                <div className="d-flex flex-column">
                  <Link
                    to={`/book/${slugify(
                      item.title.replace(/[...,:;]/g, "")
                    )}/${item.book_key}/${item.id}/about`}
                    style={{ width: 100 + "%" }}
                    className="book-item fw-bold text-white"
                    onClick={() => setIsLoading(true)}
                  >
                    {item.title}
                  </Link>
                  <span className="fw-light" style={{ color: "#b6b6b6" }}>
                    {item.authors == null ? "Author not found" : item.authors}
                  </span>

                  <span
                    className="d-flex gap-2"
                    style={{ fontSize: 14 + "px", color: "#b6b6b6" }}
                  >
                    <div className="d-flex  align-items-center">
                      {item.overall_rating != null ? (
                        <>
                          <FaStar className="me-1" /> {item.overall_rating}/5
                        </>
                      ) : (
                        "Overall rating not found"
                      )}
                    </div>
                    <div>
                      <span className="dot-separator">&#183;</span>
                      {item.reader_rating != null ? (
                        <> Rated {item.reader_rating}/5</>
                      ) : (
                        "Not rated yet"
                      )}
                    </div>
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
};

export default BookshelfBooks;
