import React from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    DOB: "",
    gender: "",
    confirmedPassword: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error);
    }

    if (res.ok) {
      navigate("/home");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center w-100">
        <div
          id="formBox"
          style={{
            backgroundColor: "#333",
            padding: 20 + "px",
            width: 600 + "px",
            height: "max-content",
            borderRadius: 10 + "px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <h4 className="text-center text-white">Sign Up</h4>
          <form
            className="d-flex flex-column gap-2"
            style={{
              backgroundColor: "#333",
              padding: "20px",
            }}
            onSubmit={handleSubmit}
          >
            <div className="field-group gap-5 d-flex justify-content-evenly">
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="firstname">Firstname</label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  className="form-control"
                  value={formData.firstname}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="lastname">Lastname</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  className="form-control"
                  value={formData.lastname}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
            </div>
            <div className="field-group gap-5 d-flex justify-content-evenly">
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
            </div>
            <div className="field-group gap-5 d-flex justify-content-evenly">
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="confirmedPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmedPassword"
                  className="form-control"
                  id="confirmedPassword"
                  value={formData.confirmedPassword}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
            </div>
            <div className="field-group gap-5 d-flex justify-content-evenly">
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="DOB">Date of Birth</label>
                <input
                  type="date"
                  name="DOB"
                  id="DOB"
                  className="form-control"
                  value={formData.DOB}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="field-wrapper w-100 d-flex flex-column gap-2">
                <label htmlFor="gender">Gender</label>
                <select
                  name="gender"
                  id="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="--"></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-outline-info mt-3">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default Signup;
