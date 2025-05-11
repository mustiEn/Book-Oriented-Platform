import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useLoaderData } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";
import BackNavigation from "../components/BackNavigation";
import { IoShield, IoStarSharp } from "react-icons/io5";
import { FaUser, FaBell } from "react-icons/fa6";
import { FaEllipsisH } from "react-icons/fa";
import dayjs from "dayjs";
import { HiMiniBookOpen } from "react-icons/hi2";
import Spinner from "../spinner/Spinner";
import "../css/notifications.css";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const notifications = useLoaderData();
  const [open, setOpen] = useState(false);
  const [hiddenNotifications, setHiddenNotifications] = useState([]);
  const [pending, setPending] = useState(false);
  const handleCustomerPortalRedirect = async () => {
    setPending(true);
    const res = await fetch("/api/create-customer-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      toast.error("Failed to redirect to customer portal");
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
    setPending(false);
  };
  const returnPremiumElement = ({ end_date, status }) => {
    const sentence =
      status == "deleted"
        ? `Your premium ended on ${dayjs.unix(end_date).format("DD.MM.YYYY")}`
        : `Your premium will end on ${dayjs
            .unix(end_date)
            .format("DD.MM.YYYY")}`;
    return (
      <>
        {status == "deleted" ? (
          <Link to={"/premium"}>
            <div className="d-flex gap-2 px-4 py-2">
              <IoStarSharp
                className="float-start"
                style={{ fontSize: "26" + "px", fill: "#f11fbe" }}
              />
              {sentence}
            </div>
          </Link>
        ) : (
          <div
            className="d-flex gap-2 px-4 py-2"
            onClick={handleCustomerPortalRedirect}
          >
            <IoStarSharp
              className="float-start"
              style={{ fontSize: "26" + "px", fill: "#f11fbe" }}
            />
            {sentence}
          </div>
        )}
      </>
    );
  };
  const returnCommentElement = ({ username, profile_photo, content }) => {
    return (
      <>
        <Link to={`/posts/comment/${content.id}`}>
          <div className="d-flex gap-2 px-4 py-2">
            <FaUser
              className="float-start"
              style={{ fontSize: "26" + "px", fill: "#65adff" }}
            />
            <div className="align-items-baseline d-flex flex-column gap-1">
              <img
                src={
                  profile_photo
                    ? "Pps_and_Bgs/" + profile_photo
                    : "https://placehold.co/45x45"
                }
                width={45}
                height={45}
                className="rounded-circle"
                alt=""
              />
              <div>
                <span className="fw-bold">@{username}</span> commented to your
                post
              </div>
            </div>
          </div>
        </Link>
      </>
    );
  };
  const returnPostElement = ({ content }) => {
    return (
      <>
        <div
          className="px-4 py-2"
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <div className="d-flex gap-2">
            <IoShield style={{ fontSize: "26" + "px", fill: "#19bdac" }} />
            <div>We removed your post due to violation of our rules</div>
          </div>
          <Collapse in={open}>
            <div id="example-collapse-text" className="fst-italic">
              "{content.text}"
            </div>
          </Collapse>
        </div>
      </>
    );
  };
  const returnBookRecommendationElement = () => {
    return (
      <>
        <Link to="/explore/books">
          <div className="d-flex gap-2 px-4 py-2">
            <HiMiniBookOpen
              style={{ fontSize: "26" + "px", fill: "#8a44ff" }}
            />
            <div>Here are some recommended books, check them out!</div>
          </div>
        </Link>
      </>
    );
  };
  const returnTopicPostElement = ({ content }) => {
    const { postId, topic, postType } = content;
    return (
      <>
        <Link to={`/${postType}/${postId}`}>
          <div className="d-flex gap-2 px-4 py-2">
            <FaBell style={{ fontSize: "26" + "px", fill: "#135ace" }} />
            <div>A new post in {topic}, check it out</div>
          </div>
        </Link>
      </>
    );
  };
  const returnStatementByType = (notification) => {
    let item;

    if (notification.type == "post") {
      item = returnPostElement(notification);
    } else if (notification.type == "premium") {
      item = returnPremiumElement(notification.content);
    } else if (notification.type == "comment") {
      item = returnCommentElement(notification);
    } else if (notification.type == "topic_post") {
      item = returnTopicPostElement(notification);
    } else {
      item = returnBookRecommendationElement();
    }
    return item;
  };
  const handleHideNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/hide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to hide notification");
      }

      setHiddenNotifications((prevState) => [...prevState, id]);
      toast.success("Notification hidden");
    } catch (error) {
      toast.error("Failed to hide notification");
    }
  };

  return (
    <>
      <BackNavigation innerHtml={"Notifications"} />
      {notifications.length > 0 ? (
        <ul id="notifications">
          {notifications.map((notification) => {
            return (
              <li
                key={notification.id}
                className={
                  hiddenNotifications.includes(notification.id)
                    ? "d-none"
                    : "position-relative border border-secondary border-opacity-50 border-start border-end"
                }
              >
                {returnStatementByType(notification)}
                <Dropdown className="notification-dropdown position-absolute">
                  <Dropdown.Toggle
                    as="button"
                    className="border-0 bg-transparent text-white"
                  >
                    <FaEllipsisH className="ellipsis p-1 rounded-circle" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleHideNotification(notification.id)}
                    >
                      Hide this notification
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="fs-5 m-3">You don't have any notifications</div>
      )}
      <Spinner pendingVal={pending} />
    </>
  );
};

export default Notifications;
