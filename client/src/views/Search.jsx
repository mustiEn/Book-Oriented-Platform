import React from "react";
import slugify from "react-slugify";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa6";
import "../css/search.css";

const Search = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    try {
      console.log("debounce");
      const res = await fetch(`/api/books/v1?q=${search}`);
      const data = await res.json();
      console.log(data);
      console.log(search);
      // const books = data.map((book) => {
      //   book.volumeInfo.title =
      //     book.volumeInfo.title.length > 125
      //       ? book.volumeInfo.title.slice(0, 125) + "..."
      //       : book.volumeInfo.title;
      //   if (book.volumeInfo.authors === undefined) {
      //     book.volumeInfo.authors = "Unknown";
      //   } else {
      //     if (typeof book.volumeInfo.authors !== "string") {
      //       book.volumeInfo.authors =
      //         book.volumeInfo.authors.length >= 2
      //           ? book.volumeInfo.authors[0] +
      //             ", " +
      //             book.volumeInfo.authors[1]
      //           : book.volumeInfo.authors;
      //     }
      //   }
      //   return book;
      // });

      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const tim = setTimeout(() => {
      if (search != "") {
        getBooks();
      }
    }, 1500);

    return () => clearInterval(tim);
  }, [search]);

  return (
    <>
      <form action="" method="get" className="w-100">
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-100 form-control"
          placeholder="Search.."
        />
      </form>
      <ul className="padding-2">
        {books.length === 0 && search !== "" && <li>No books found</li>}
        {books.length !== 0 &&
          search !== "" &&
          books.map((book) => (
            <li
              key={book.book_id}
              className="mt-3 p-2"
              // style={{ height: 170 + "px" }}
            >
              <Link
                to={`/book/${slugify(book.title.replace(/[...,:;]/g, ""))}/${
                  book.book_id
                }`}
                className="text-decoration-none text-white d-flex align-items-center gap-3 p-2 search-book-item"
                style={{ height: 170 + "px" }}
              >
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    width={90 + "px"}
                    height={140 + "px"}
                    alt=""
                  />
                ) : (
                  <div className="text-center" style={{ width: 90 + "px" }}>
                    Image not found
                  </div>
                )}
                <div className="d-flex flex-column">
                  <span className="fw-bold fs-5" title={book.title}>
                    {book.truncatedTitle}
                  </span>
                  <span className="fw-light">
                    {book.publishers == null
                      ? "Publisher not found"
                      : "Publisher: " + book.publishers}
                  </span>
                  <span className="fw-light">
                    {book.authors == null
                      ? "Author not found"
                      : "Author: " + book.authors}
                  </span>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Search;
