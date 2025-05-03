import React, { useEffect, useState } from "react";
import "../css/left_sidebar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBook, FaEllipsis } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser, FaMagnifyingGlass } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { LiaCubesSolid } from "react-icons/lia";
import { PiMoneyWavy } from "react-icons/pi";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-hot-toast";

const LeftSidebar = ({ loggedInReader }) => {
  const navigate = useNavigate();
  const { user, unReadNotifications } = loggedInReader;
  const [hasSub, setHasSub] = useState(user[0].customer_id ? true : false);
  const [notificationExists, setNotificationExists] = useState(
    unReadNotifications[0].unread ? true : false
  );
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
  const handleCustomerPortalRedirect = async () => {
    const res = await fetch("/api/create-customer-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { url } = await res.json();
    window.open(url, "_blank");
  };
  const handleNotificationClick = async () => {
    try {
      const res = await fetch("/api/notifications/mark-as-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        toast.error("Failed to mark notifications as read");
      }

      setNotificationExists(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  const fetchInitalData = async () => {
    try {
      const res = await fetch("/api/get-reader-info");

      if (!res.ok) {
        toast.error("Failed to fetch initial data");
      }

      const { user } = await res.json();
      setHasSub(user[0].customer_id ? true : false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, [search]);

  useEffect(() => {
    fetchInitalData();
  }, []);

  console.log(user[0], hasSub);

  return (
    <>
      <div
        id="leftSidebar"
        className="d-flex align-self-start p-2 overflow-y-auto gap-2 flex-column position-sticky top-0 "
      >
        <ul>
          <li className="left-sidebar-item">
            <Link
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/home"
            >
              <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                <img
                  src={"/logo.png"}
                  loading="lazy"
                  className="left-sidebar-a-inner-icon"
                />
              </div>
            </Link>
          </li>
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/home"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <AiOutlineHome className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Home
                  </span>
                </div>
              )}
            </NavLink>
          </li>
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/notifications"
              onClick={handleNotificationClick}
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <div className="position-relative">
                    <FaRegBell className="left-sidebar-a-inner-icon " />
                    {notificationExists ? (
                      <span
                        className="position-absolute top-0 start-100 translate-middle  rounded-circle text-center bg-danger"
                        style={{
                          width: 18 + "px",
                          height: "auto",
                          fontSize: 12 + "px",
                        }}
                      >
                        {unReadNotifications[0].unread >= 100
                          ? +"99+"
                          : unReadNotifications[0].unread}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Notifications
                  </span>
                </div>
              )}
            </NavLink>
          </li>
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/search"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <FaMagnifyingGlass className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Search
                  </span>
                </div>
              )}
            </NavLink>
          </li>
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/explore"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <MdOutlineExplore className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Explore
                  </span>
                </div>
              )}
            </NavLink>
          </li>
          {/* <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/explore/topics"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <TfiPalette className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Topics
                  </span>
                </div>
              )}
            </NavLink>
          </li> */}
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/book-categories"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <LiaCubesSolid className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Book Categories
                  </span>
                </div>
              )}
            </NavLink>
          </li>
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to="/premium"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <MdOutlineWorkspacePremium className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Premium
                  </span>
                </div>
              )}
            </NavLink>
          </li>
          {hasSub && (
            <li className="left-sidebar-item">
              <div
                className="btn text-white p-2"
                onClick={handleCustomerPortalRedirect}
              >
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <PiMoneyWavy className="left-sidebar-a-inner-icon" />
                  <span className={"left-sidebar-a-inner-text fs-5"}>
                    Subscription
                  </span>
                </div>
              </div>
            </li>
          )}
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-2"
              to={`/${user[0].username}`}
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <FaRegUser className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold"
                        : "left-sidebar-a-inner-text fs-5"
                    }
                  >
                    Profile
                  </span>
                </div>
              )}
            </NavLink>
          </li>
        </ul>
        <Dropdown className="mt-auto">
          <Dropdown.Toggle
            id="dropdown-basic-button"
            variant="outline-light"
            className="w-100"
          >
            Create post
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/share-thought">
              Thought
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/share-review">
              Review
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/share-quote">
              Quote
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button
          variant="outline-light"
          onClick={() => navigate("/create-topic")}
        >
          Create Topic
        </Button>
        <Dropdown className="profile-dropdown" dark-bs-theme="dark">
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
                  {user[0].firstname} {user[0].lastname}
                </span>
                <span>@{user[0].username}</span>
              </div>
              <FaEllipsis className="ms-auto" />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100">
            <Dropdown.Item href="/login">Logout</Dropdown.Item>
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
              <li className="left-sidebar-item">No books found</li>
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
                    {book.volumeInfo.imageNavLinks ? (
                      <img
                        src={book.volumeInfo.imageNavLinks.smallThumbnail}
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

export default LeftSidebar;
