import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import { FaEllipsis } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

const Sidebar = ({ pos, loggedInReader }) => {
  const navigate = useNavigate();
  const reader = loggedInReader;
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBooks = () => {
    try {
      if (search !== "") {
        setTimeout(async () => {
          const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=20`
          );
          const data = await res.json();

          const books = data.items.map((book) => {
            book.volumeInfo.title =
              book.volumeInfo.title.length > 125
                ? book.volumeInfo.title.slice(0, 125) + "..."
                : book.volumeInfo.title;
            if (book.volumeInfo.authors === undefined) {
              book.volumeInfo.authors = "Unknown";
            } else {
              if (typeof book.volumeInfo.authors !== "string") {
                book.volumeInfo.authors =
                  book.volumeInfo.authors.length >= 2
                    ? book.volumeInfo.authors[0] +
                      ", " +
                      book.volumeInfo.authors[1]
                    : book.volumeInfo.authors;
              }
            }
            return book;
          });
          setBooks(books);
          setLoading(true);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getBooks();
  }, [search]);

  return (
    <>
      <div id="sidebar" className={`${pos} border-end d-flex flex-column`}>
        <div id="brandName">My Books</div>
        <ul className="mt-4">
          <li className="sidebar-item">
            <Link className="sidebar-a" to="/">
              Home
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to="/search">
              Search
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to="/explore">
              Explore
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to="/topics">
              Topics
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to="/books">
              Books
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to="/authors">
              Authors
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to="#">
              Contact
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-a" to={`/${reader.username}`}>
              Profile
            </Link>
          </li>
          <li>
            <Button variant="primary">Create Post</Button>
          </li>
          <li>
            <Button variant="primary" onClick={() => navigate("/create-topic")}>
              Create Topic
            </Button>
          </li>
        </ul>
        <Dropdown className="profile-dropdown mt-auto" dark-bs-theme="dark">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="w-100 p-0"
            style={{ height: 60 + "px" }}
          >
            <div className="d-flex align-items-center gap-2 p-2">
              <img
                src="https://placehold.co/40x40"
                className="rounded-circle"
                alt=""
              />
              <div className="d-flex flex-column">
                <span>
                  {reader.firstname} {reader.lastname}
                </span>
                <span>@{reader.username}</span>
              </div>
              <FaEllipsis className="ms-auto" />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100">
            <Dropdown.Item href="/">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Modal show={show} onHide={handleClose} data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>Select a book</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "700" + "px", overflowY: "auto" }}>
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
            {loading && books.length === 0 && <FaSpinner />}
            {books.length === 0 && loading === false && search !== "" && (
              <li className="sidebar-item">No books found</li>
            )}
            {books.length !== 0 &&
              search !== "" &&
              books.map((book) => (
                <li key={book.id} className="mt-3 p-2">
                  <div
                    // to={`/share-review/${book.id}`}
                    className="text-decoration-none text-white d-flex align-items-center gap-3 p-2 book-item"
                    onClick={() => {
                      navigate(`/share-review/${book.id}`);
                      handleClose();
                    }}
                  >
                    {book.volumeInfo.imageLinks ? (
                      <img
                        src={book.volumeInfo.imageLinks.smallThumbnail}
                        width={50 + "px"}
                        alt=""
                      />
                    ) : (
                      <div>Image not found</div>
                    )}
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{book.volumeInfo.title}</span>
                      <span className="fw-light">
                        {book.volumeInfo.authors}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sidebar;
