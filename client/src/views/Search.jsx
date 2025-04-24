import React from "react";
import slugify from "react-slugify";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../css/search.css";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";

const Search = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [pending, setPending] = useState(false);

  const getBooks = async () => {
    try {
      const res = await fetch(`/api/books/v1?q=${search}`);
      let data = await res.json();

      if (!res.ok) {
        throw new Error(res.error);
      }

      setPending(false);
      setBooks(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (search != "") {
      setPending(true);
      const time = setTimeout(() => {
        getBooks();
      }, 1500);
      return () => clearInterval(time);
    } else {
      setPending(false);
      setBooks("");
    }
  }, [search]);

  return (
    <>
      <Form data-bs-theme="dark" className="p-2">
        <InputGroup>
          <InputGroup.Text>
            <FaMagnifyingGlass />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search in BookNest"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Form.Control>
        </InputGroup>
      </Form>

      <ul className="p-2 books">
        {/* {books.length === 0 && search !== "" && <li>No books found</li>} */}
        {books.length !== 0
          ? books.map((book) => (
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
                    <LazyLoadImage
                      src={book.thumbnail}
                      loading="lazy"
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
                    <span className="fw-light" title={book.publishers}>
                      {book.publishers == null
                        ? "Publisher not found"
                        : book.publishers.length > 60
                        ? "Publisher: " + book.publishers.slice(0, 60) + "..."
                        : "Publisher: " + book.publishers}
                    </span>
                    <span className="fw-light" title={book.authors}>
                      {book.authors == null
                        ? "Author not found"
                        : book.authors.length > 60
                        ? "Author: " + book.authors.slice(0, 60) + "..."
                        : "Author: " + book.authors}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          : search != "" && pending == false && <div>No books found</div>}
      </ul>
      <Spinner pendingVal={pending} />
    </>
  );
};

export default Search;
