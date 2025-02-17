import React, { useState, useRef, useEffect } from "react";
import {
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";
import { FaCalendar, FaClockRotateLeft } from "react-icons/fa6";
import Button from "react-bootstrap/Button";
import "../css/reader_profile.css";

const ReaderProfile = () => {
  const reader = useOutletContext();
  const [readerProfileData, setReaderProfileData] = useState({});
  const data = useLoaderData();
  const regex = /^[a-zA-Z0-9-_]+(\.(jpg|jpeg|png||webp))$/i;
  const bgRef = useRef(null);
  const ppRef = useRef(null);
  const { profile } = useParams();

  const handleBgRef = () => {
    bgRef.current.click();
  };
  const handlePpRef = () => {
    ppRef.current.click();
  };

  const updatePp = async (fileInput) => {
    try {
      const formData = new FormData();
      formData.append("ppImage", fileInput);
      if (!regex.test(fileInput.name)) {
        throw new Error("Invalid file type");
      }
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      console.log(fileInput);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      getUpdatedReaderProfile("Profile");
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const updateBg = async (fileInput) => {
    try {
      const formData = new FormData();
      formData.append("bgImage", fileInput);
      if (!regex.test(fileInput.name)) {
        throw new Error("Invalid file type");
      }
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(data.error);
      }

      const data = await response.json();
      getUpdatedReaderProfile("Background");
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUpdatedReaderProfile = async (photo) => {
    try {
      const res = await fetch(
        `/api/${readerProfileData.username}/display-reader-profile`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(res.error);
      }
      console.log(data);
      toast.success(`${photo} photo updated successfully`);
      setReaderProfileData(data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    setReaderProfileData(data);
    console.log(`loggedin reader \n ${reader}`);
    console.log(`readerprofiledata \n ${readerProfileData}`);
  }, []);

  return (
    <>
      <div className="profile-header">
        <div
          style={{
            backgroundImage:
              readerProfileData.background_photo == null
                ? `url("https://r2.1k-cdn.com/sig/size:640/plain/https%3A%2F%2F1k-cdn.com%2Fresimler%2FLogo%2F131_ask-tile3.jpg")`
                : `url(/Pps_and_Bgs/${readerProfileData.background_photo})`,
            height: 300 + "px",
            width: 100 + "%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          <div id="bgImageInput">
            <input
              type="file"
              name="bgImage"
              id=""
              hidden
              ref={bgRef}
              onChange={(e) => {
                updateBg(e.target.files[0]);
                console.log("bg", e.target.files[0]);
              }}
            />
            <button
              className="p-0 rounded-5 border border-1 border-light d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#1d1f20",
                width: 50 + "px",
                height: 50 + "px",
              }}
              onClick={handleBgRef}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                fill="white"
              >
                <path d="M6.667 5.333h-4v-1.333h4v1.333zM21.24 5.333l1.083 1.625c0.991 1.487 2.649 2.375 4.437 2.375h2.573v17.333h-26.667v-17.333h5.24c1.788 0 3.447-0.888 4.437-2.375l1.083-1.625h7.813zM22.667 2.667h-10.667l-1.875 2.812c-0.495 0.743-1.327 1.188-2.219 1.188h-7.907v22.667h32v-22.667h-5.24c-0.892 0-1.724-0.445-2.219-1.188l-1.875-2.812zM8 13.333c0-0.736-0.596-1.333-1.333-1.333s-1.333 0.597-1.333 1.333 0.596 1.333 1.333 1.333 1.333-0.597 1.333-1.333zM17.333 13.333c2.205 0 4 1.795 4 4s-1.795 4-4 4-4-1.795-4-4 1.795-4 4-4zM17.333 10.667c-3.681 0-6.667 2.985-6.667 6.667s2.985 6.667 6.667 6.667 6.667-2.985 6.667-6.667-2.985-6.667-6.667-6.667z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-between px-3"
          style={{ height: 60 + "px" }}
        >
          <div
            style={{
              backgroundImage:
                readerProfileData.profile_photo == null
                  ? `url("https://placehold.co/120x120")`
                  : `url(/Pps_and_Bgs/${readerProfileData.profile_photo})`,
              height: 120 + "px",
              width: 120 + "px",
              backgroundSize: 100 + "%",
              backgroundRepeat: "no-repeat",
              top: -2 + "rem",
            }}
            className="d-flex align-items-center justify-content-center rounded-circle position-relative"
          >
            <div id="ppImageInput">
              <input
                type="file"
                name="ppImage"
                id=""
                hidden
                ref={ppRef}
                onChange={(e) => {
                  updatePp(e.target.files[0]);
                  console.log("pp", e.target.files[0]);
                }}
              />
              <button
                className="p-0 rounded-5 border border-1 border-light d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: "#1d1f20",
                  width: 50 + "px",
                  height: 50 + "px",
                }}
                onClick={() => handlePpRef()}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                  fill="white"
                >
                  <path d="M6.667 5.333h-4v-1.333h4v1.333zM21.24 5.333l1.083 1.625c0.991 1.487 2.649 2.375 4.437 2.375h2.573v17.333h-26.667v-17.333h5.24c1.788 0 3.447-0.888 4.437-2.375l1.083-1.625h7.813zM22.667 2.667h-10.667l-1.875 2.812c-0.495 0.743-1.327 1.188-2.219 1.188h-7.907v22.667h32v-22.667h-5.24c-0.892 0-1.724-0.445-2.219-1.188l-1.875-2.812zM8 13.333c0-0.736-0.596-1.333-1.333-1.333s-1.333 0.597-1.333 1.333 0.596 1.333 1.333 1.333 1.333-0.597 1.333-1.333zM17.333 13.333c2.205 0 4 1.795 4 4s-1.795 4-4 4-4-1.795-4-4 1.795-4 4-4zM17.333 10.667c-3.681 0-6.667 2.985-6.667 6.667s2.985 6.667 6.667 6.667 6.667-2.985 6.667-6.667-2.985-6.667-6.667-6.667z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <Button variant="primary">Edit</Button>
            <Button variant="primary">Share</Button>
          </div>
        </div>
        <div className="profile-info d-flex flex-column gap-2 px-3 mb-3">
          <div className="fs-4">
            {readerProfileData.firstname} {readerProfileData.lastname}
          </div>
          <div className="d-flex gap-3">
            <div style={{ color: "#b6b6b6" }}>
              @{readerProfileData.username}
            </div>
            <div
              style={{ fontSize: 14 + "px", backgroundColor: "#262626" }}
              className="rounded-2 px-2"
            >
              {readerProfileData.readership}
            </div>
          </div>
          <div className="d-flex gap-3">
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#b6b6b6" }}
            >
              <FaCalendar />
              {moment(readerProfileData.DOB).format("D MMMM YYYY")}
            </div>
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#b6b6b6" }}
            >
              <FaClockRotateLeft />
              Joined in{" "}
              {moment(readerProfileData.createdAt).format("MMMM YYYY")}
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="d-flex gap-2">
              <div>0</div>
              <div style={{ color: "#b6b6b6" }}>Books</div>
            </div>
            <div className="d-flex gap-2">
              <div>0</div>
              <div style={{ color: "#b6b6b6" }}>Reviews</div>
            </div>
          </div>
        </div>
      </div>
      <ul className="d-flex gap-2 px-3">
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/${reader.username}`}
            end
          >
            Reviews
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/${profile}/bookshelf`}
          >
            Bookshelf
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/${profile}/quotes`}
          >
            Quotes
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/${profile}/thoughts`}
          >
            Thoughts
          </NavLink>
        </li>
        <li>
          <NavLink
            className="reader-profile-link p-2 text-decoration-none d-block rounded-top-3"
            style={({ isActive }) => ({
              color: isActive ? "white" : "#b6b6b6",
              backgroundColor: isActive ? "#ffffff14" : "",
            })}
            to={`/${profile}/comments`}
          >
            Comments
          </NavLink>
        </li>
      </ul>
      <hr className="mb-3 mt-0" />
      <div className="px-3">
        <Outlet
          context={[
            moment(readerProfileData.createdAt).format("YYYY"),
            reader.username,
          ]}
        />
      </div>
    </>
  );
};

export default ReaderProfile;
