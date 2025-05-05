import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const Signup = () => {
  const [error, setError] = useState("");
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
    console.log(formData);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);

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
    <div
      id="formBox"
      style={{
        backgroundColor: "#333",
        padding: "20px",
        width: "600px",
        borderRadius: "10px",
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
        //   method="post"
      >
        <div className="field-group gap-5 d-flex justify-content-evenly">
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="firstname" className="text-white">
              Firstname
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="form-control text-white bg-dark"
              value={formData.firstname}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="lastname" className="text-white">
              Lastname
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="form-control text-white bg-dark"
              value={formData.lastname}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>
        <div className="field-group gap-5 d-flex justify-content-evenly">
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="form-control text-white bg-dark"
              id="username"
              value={formData.username}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control text-white bg-dark"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>
        <div className="field-group gap-5 d-flex justify-content-evenly">
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control text-white bg-dark"
              id="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="confirmedPassword" className="text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmedPassword"
              className="form-control text-white bg-dark"
              id="confirmedPassword"
              value={formData.confirmedPassword}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>
        <div className="field-group gap-5 d-flex justify-content-evenly">
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="DOB" className="text-white">
              Date of Birth
            </label>
            <input
              type="date"
              name="DOB"
              id="DOB"
              className="form-control text-white bg-dark"
              value={formData.DOB}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="field-wrapper w-100 d-flex flex-column gap-2">
            <label htmlFor="gender" className="text-white">
              Gender
            </label>
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
  );
};

export default Signup;
