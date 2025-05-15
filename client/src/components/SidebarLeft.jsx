import React, { useEffect, useState } from "react";
import "../css/left_sidebar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBook, FaEllipsis } from "react-icons/fa6";
import Offcanvas from "react-bootstrap/Offcanvas";
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
import { RiQuillPenFill } from "react-icons/ri";
import { TiTag } from "react-icons/ti";
import { useMedia } from "use-media";

const LeftSidebar = ({ loggedInReader }) => {
  const isWide = useMedia({ minWidth: "1200px" });
  const { user, unReadNotifications } = loggedInReader;
  const hasSub = user[0].customer_id ? true : false;
  const [notificationExists, setNotificationExists] = useState(
    unReadNotifications[0].unread ? true : false
  );
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

  return (
    <>
      <div
        id="leftSidebar"
        className={
          "d-flex align-self-start p-2 gap-2 flex-column position-sticky top-0"
        }
      >
        <ul className="d-flex flex-column gap-2">
          <li className="left-sidebar-item">
            <Link
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/home"
            >
              <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                <img src={"/logo.png"} loading="lazy" id="leftSidebarIcon" />
              </div>
            </Link>
          </li>
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/home"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <AiOutlineHome className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/notifications"
              onClick={handleNotificationClick}
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <div className="position-relative">
                    <FaRegBell className="left-sidebar-a-inner-icon " />
                    {notificationExists ? (
                      <span
                        className="align-items-center bg-danger d-flex justify-content-center position-absolute rounded-circle start-100 top-0 translate-middle"
                        style={{
                          width: 22 + "px",
                          height: 22 + "px",
                          fontSize: 12 + "px",
                        }}
                      >
                        {unReadNotifications[0].unread >= 100
                          ? +"99"
                          : unReadNotifications[0].unread}
                        +
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/search"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <FaMagnifyingGlass className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/explore"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <MdOutlineExplore className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/explore/topics"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <TfiPalette className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/book-categories"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <LiaCubesSolid className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to="/premium"
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <MdOutlineWorkspacePremium className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
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
                  <span className="left-sidebar-a-inner-text fs-5 d-none d-xl-block">
                    Subscription
                  </span>
                </div>
              </div>
            </li>
          )}
          <li className="left-sidebar-item">
            <NavLink
              className="left-sidebar-a text-decoration-none text-white d-block p-xl-2"
              to={`/profile/${user[0].username}`}
            >
              {({ isActive }) => (
                <div className="left-sidebar-a-inner d-flex gap-2 align-items-center">
                  <FaRegUser className="left-sidebar-a-inner-icon" />
                  <span
                    className={
                      isActive
                        ? "left-sidebar-a-inner-text fs-5 fw-bold d-none d-xl-block"
                        : "left-sidebar-a-inner-text fs-5 d-none d-xl-block"
                    }
                  >
                    Profile
                  </span>
                </div>
              )}
            </NavLink>
          </li>
        </ul>
        <Dropdown className="mt-auto" drop={!isWide ? "end" : "up"}>
          <Dropdown.Toggle
            id="dropdown-basic-button"
            variant="outline-light"
            className="w-100"
          >
            {!isWide ? <RiQuillPenFill /> : "Create post"}
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
        <Button variant="outline-light" as={Link} to="/create-topic">
          {!isWide ? <TiTag /> : "Create topic"}
        </Button>
        <Dropdown className="profile-dropdown" dark-bs-theme="dark">
          <Dropdown.Toggle
            id="dropdown-basic"
            className={!isWide ? "w-100 rounded-circle p-0" : "w-100 p-0"}
            style={{ height: 60 + "px" }}
          >
            {!isWide ? (
              <img
                src={
                  user[0].profile_photo
                    ? `/Pps_and_Bgs/${user[0].profile_photo}`
                    : "https://placehold.co/35"
                }
                className="rounded-circle"
                width={45}
                height={45}
                alt=""
              />
            ) : (
              <div className="d-flex align-items-center gap-2 p-2">
                <img
                  src={
                    user[0].profile_photo
                      ? `/Pps_and_Bgs/${user[0].profile_photo}`
                      : "https://placehold.co/35"
                  }
                  className="rounded-circle"
                  width={45}
                  height={45}
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
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100">
            <Dropdown.Item href="/login">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default LeftSidebar;
