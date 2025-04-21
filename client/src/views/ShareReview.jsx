import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import Select from "react-select";

const ShareReview = () => {
  const navigate = useNavigate();
  const [bookData, topics] = useLoaderData();
  const [review, setReview] = useState({
    title: "",
    topic: "",
    review: "",
  });
  const selectStyle = {
    option: (provided, state) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isSelected ? "#e0e0e0" : "white",
    }),
  };
  const [book] = bookData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review.title === "" || review.review === "" || review.topic === "") {
      toast.error("Please fill all the fields");
      return;
    } else {
      review.bookId = book.id;
      console.log(review);

      const res = await fetch(`/api/share-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        toast.success("Review added successfully");
        setReview({
          title: "",
          topic: "",
          review: "",
        });
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <FaArrowLeft
        id="arrow-left"
        className="rounded-circle p-2"
        onClick={() => navigate(-1)}
      />
      <div id="reviewContainer" className="w-100 p-4">
        <div className="book-details-header w-100 d-flex align-items-center gap-3">
          {book.thumbnail ? (
            <img src={book.thumbnail} width={80 + "px"} alt="" />
          ) : (
            <div>Image not found</div>
          )}
          <div className="d-flex flex-column">
            <span className="book-title fs-3 ">{book.title}</span>
            <span className="book-author fs-6 ">{book.authors}</span>
          </div>
        </div>
        <div className="fw-bold fs-5 mt-4">Your Review</div>
        <Form className="d-flex flex-column gap-3 border p-3">
          <Select
            options={topics}
            styles={selectStyle}
            name="topic"
            onChange={(e) => {
              setReview({
                ...review,
                topic: e.label,
              });
            }}
          />
          <Form.Group controlId="formBasicTitle">
            <Form.Label className="fw-bold mb-1 fs-6">Title</Form.Label>
            <Form.Control
              type="text"
              value={review.title}
              onChange={(e) => {
                setReview({
                  ...review,
                  title: e.target.value,
                });
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="formBasicReview">
            <Form.Label className="fw-bold mb-1 fs-6">Review</Form.Label>
            <Form.Control
              as="textarea"
              value={review.review}
              onChange={(e) => {
                setReview({
                  ...review,
                  review: e.target.value,
                });
              }}
            ></Form.Control>
          </Form.Group>
          <Button variant="light" onClick={handleSubmit}>
            Share
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ShareReview;
