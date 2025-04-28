import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Link, NavLink, useLoaderData } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";
import BackNavigation from "../components/BackNavigation";
import { FaComment } from "react-icons/fa6";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { IoShield, IoStarSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import dayjs from "dayjs";

const Notifications = () => {
  const notifications = useLoaderData();
  const [open, setOpen] = useState(false);
  const [listHover, setListHover] = useState(null);
  const handleListHoverOnMouseOver = (id) => setListHover(id);
  const handleListHoverOnMouseOut = () => setListHover(null);
  const handleCustomerPortalRedirect = async () => {
    const res = await fetch("/api/create-customer-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { url } = await res.json();
    window.location.href = url;
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
        <Link to={`/comment/${content.id}`}>
          <div className="d-flex gap-2 px-4 py-2">
            <FaUser
              className="float-start"
              style={{ fontSize: "26" + "px", fill: "#65adff" }}
            />
            <div className="align-items-baseline d-flex flex-column gap-1">
              <img
                src={profile_photo ?? "https://placehold.co/45x45"}
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
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <div className="d-flex gap-2 px-4 py-2">
            <IoShield style={{ fontSize: "26" + "px", fill: "#19bdac" }} />
            <div>We removed your post due to violation of our rules</div>
          </div>
          <Collapse in={open}>
            <div id="example-collapse-text" className="fst-italic">
              {content.text}
            </div>
          </Collapse>
        </div>
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
    }
    return item;
  };

  return (
    <>
      <BackNavigation innerHtml={"Notifications"} />
      <ul>
        {notifications.map((notification) => {
          return (
            <li
              key={notification.id}
              className={
                listHover == notification.id
                  ? "border border-secondary border-opacity-50 border-start border-end bg-dark"
                  : "border border-secondary border-opacity-50 border-start border-end"
              }
              onMouseOver={() => handleListHoverOnMouseOver(notification.id)}
              onMouseOut={handleListHoverOnMouseOut}
            >
              {returnStatementByType(notification)}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Notifications;
