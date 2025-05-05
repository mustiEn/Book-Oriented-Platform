import React from "react";
import { useLoaderData } from "react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import BackNavigation from "../components/BackNavigation";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

const ShareQuote = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [validated, setValidated] = useState(false);
  const [quote, setQuote] = useState({
    title: "",
    topic: null,
    quote: "",
    page_count: "",
    bookId: null,
  });
  const topics = useLoaderData();
  const selectStyle = {
    option: (provided, state) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isSelected ? "#e0e0e0" : "white",
    }),
  };
  const asyncSelectStyle = {
    control: (base, state) => ({
      ...base,
      border: validated && !selectedBook ? "1px solid red" : "none",
    }),
  };
  const customOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="d-flex align-items-center gap-2 m-2"
    >
      <img src={data.thumbnail} width={40} height={60} alt="image" />
      <div style={{ color: "black" }} className="d-flex flex-column">
        <div>
          {data.label == null
            ? "Author not found"
            : data.label.length > 60
            ? data.label.slice(0, 60) + "..."
            : data.label}
        </div>
        <div>
          {data.authors == null
            ? "Author not found"
            : data.authors.length > 60
            ? data.authors.slice(0, 60) + "..."
            : data.authors}
        </div>
      </div>
    </div>
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!quote.bookId || !e.currentTarget.checkValidity()) {
      e.stopPropagation();
      return;
    }
    const res = await fetch(`/api/share-quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      setQuote({
        title: "",
        topic: null,
        page_count: "",
        quote: "",
        bookId: null,
      });
      setSelectedBook(null);
      setValidated(false);
    } else {
      toast.error("Something went wrong");
    }
  };
  const loadBooks = async (val) => {
    const res = await fetch(`/api/books/v1?q=${val}`);

    if (!res.ok) {
      toast.error("Something went wrong");
    }

    let data = await res.json();
    data = data.map((item) => ({
      ...item,
      label: item.truncatedTitle,
      value: item.id,
    }));
    console.log(data);

    return data;
  };

  return (
    <>
      <BackNavigation innerHtml={"Quote"} />
      <div className="fw-bold fs-5 mt-4 mx-3">Your Quote</div>
      <Form
        className="d-flex flex-column gap-3 p-3"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Form.Group controlId="formBasicBook">
          <Form.Label className="fw-bold mb-1 fs-6">Book *</Form.Label>
          <AsyncSelect
            cacheOptions
            placeholder="Search for a book"
            loadOptions={loadBooks}
            components={{ Option: customOption }}
            isClearable
            styles={asyncSelectStyle}
            value={selectedBook ?? null}
            onChange={(newValue) => {
              setQuote((prevState) => ({
                ...prevState,
                bookId: newValue ? newValue.id : null,
              }));
              setSelectedBook(newValue ?? null);
              console.log(newValue);
            }}
          />
          {validated && !selectedBook && (
            <div className="invalid-feedback d-block">Please select a book</div>
          )}
        </Form.Group>
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: "auto" }}
              transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
              }}
              exit={{ opacity: 0, height: 0 }}
              className="text-white d-flex align-items-center gap-3 p-2"
            >
              <img
                src={selectedBook.thumbnail}
                width={80}
                height={110}
                style={{ objectFit: "cover", borderRadius: "4px" }}
                alt="Book"
              />
              <div className="d-flex flex-column">
                <span className="fw-bold fs-4" title={selectedBook.title}>
                  {selectedBook.truncatedTitle}
                </span>
                <span className="fw-light" title={selectedBook.publishers}>
                  {selectedBook.publishers == null
                    ? "Publisher not found"
                    : selectedBook.publishers.length > 60
                    ? "Publisher: " +
                      selectedBook.publishers.slice(0, 60) +
                      "..."
                    : "Publisher: " + selectedBook.publishers}
                </span>
                <span className="fw-light" title={selectedBook.authors}>
                  {selectedBook.authors == null
                    ? "Author not found"
                    : selectedBook.authors.length > 60
                    ? "Author: " + selectedBook.authors.slice(0, 60) + "..."
                    : "Author: " + selectedBook.authors}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Form.Group controlId="formBasicPageCount">
          <Form.Label className="fw-bold mb-1 fs-6">Page Count *</Form.Label>
          <Form.Control
            type="number"
            value={quote?.page_count}
            min={1}
            required
            placeholder="Reference page number"
            disabled={!selectedBook}
            max={selectedBook ? selectedBook.page_count : 1000}
            onChange={(e) =>
              setQuote((prevState) => ({
                ...prevState,
                page_count: Number(e.target.value),
              }))
            }
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a page number.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formBasicTopic">
          <Form.Label className="fw-bold mb-1 fs-6">Topic</Form.Label>
          <Select
            options={topics}
            styles={selectStyle}
            name="topic"
            placeholder="Select a topic"
            value={topics.find((option) => option.label == quote.topic) || ""}
            onChange={(e) => {
              setQuote({
                ...quote,
                topic: e.label,
              });
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicTitle">
          <Form.Label className="fw-bold mb-1 fs-6">Title *</Form.Label>
          <Form.Control
            type="text"
            value={quote.title}
            required
            placeholder="Quote title"
            onChange={(e) => {
              setQuote({
                ...quote,
                title: e.target.value,
              });
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a title.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formBasicQuote">
          <Form.Label className="fw-bold mb-1 fs-6">Quote *</Form.Label>
          <Form.Control
            as="textarea"
            value={quote.quote}
            required
            placeholder="Quote"
            onChange={(e) => {
              setQuote({
                ...quote,
                quote: e.target.value,
              });
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a quote.
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="outline-light" type="submit">
          Share
        </Button>
      </Form>
    </>
  );
};

export default ShareQuote;
