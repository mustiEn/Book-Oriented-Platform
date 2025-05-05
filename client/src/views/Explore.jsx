import React from "react";
import { Outlet, NavLink, useLoaderData } from "react-router";
import "../css/explore.css";

const Explore = () => {
  return (
    <>
      <ul className="d-flex justify-content-evenly gap-2 mt-5">
        <li>
          <NavLink
            className="reader-profile-link py-2 px-4 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/explore`}
            end
          >
            General
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link py-2 px-4 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`topics`}
          >
            Topics
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link py-2 px-4 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`books`}
          >
            Books
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link py-2 px-4 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`readers`}
          >
            Readers
          </NavLink>
        </li>
      </ul>
      <hr className="mt-0 mb-3" />
      <Outlet />
    </>
  );
};

export default Explore;
