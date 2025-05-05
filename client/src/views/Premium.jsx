import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/esm/Form";
import Badge from "react-bootstrap/esm/Badge";
import Card from "react-bootstrap/Card";
import { Link, redirect, useNavigate } from "react-router";
import Button from "react-bootstrap/esm/Button";

const Premium = () => {
  const navigate = useNavigate();
  const [premium, setPremium] = useState("Annual");
  const bulletPoints = [
    "Profile Badge",
    "Edit post",
    "Longer posts",
    "Ad-free",
  ];

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ premiumType: premium }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data);
      window.location.replace(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="mt-5 text-center">Upgrade to Premium</h2>
      <p className="text-center">
        Enjoy an enhanced experience and exclusive features
      </p>
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex gap-2 my-5">
          <Button
            variant={premium == "Annual" ? "light" : "outline-light"}
            onClick={() => setPremium("Annual")}
          >
            Annual <Badge bg="success">Best Value</Badge>
          </Button>
          <Button
            variant={premium == "Monthly" ? "light" : "outline-light"}
            onClick={() => setPremium("Monthly")}
          >
            Monthly
          </Button>
        </div>
        <Card style={{ width: "18rem" }} data-bs-theme="dark">
          <Card.Body>
            <Card.Title>Premium</Card.Title>
            <Card.Subtitle className="my-2">
              <span className="fw-bold h2">
                &#163;{premium == "Annual" ? "8.40 " : "9.60 "}
              </span>
              / month
              <div>
                {premium == "Annual" ? (
                  <>
                    &#163;100.80 billed annually
                    <Badge bg="success" className="ms-1">
                      Save 12.5%
                    </Badge>
                  </>
                ) : (
                  "Billed monthly"
                )}
              </div>
            </Card.Subtitle>
            <Card.Text>
              <div className="fw-bold">Features</div>
              <ul>
                {bulletPoints.map((item, i) => (
                  <li key={i}>&#10003; {item}</li>
                ))}
              </ul>
            </Card.Text>
            <Button className="btn btn-primary" onClick={handleSubmit}>
              Subscribe
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Premium;
