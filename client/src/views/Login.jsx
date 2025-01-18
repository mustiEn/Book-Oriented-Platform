import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      navigate("/");
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
      <h4 className="text-center text-white">Login</h4>
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
        </div>

        <button type="submit" className="btn btn-outline-info mt-3">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
