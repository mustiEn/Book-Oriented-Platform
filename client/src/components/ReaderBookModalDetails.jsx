import React, { useEffect, useRef } from "react";
import { FaLock } from "react-icons/fa6";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "../spinner/Spinner";
import { toast } from "react-hot-toast";

const ReaderBookModalDetails = ({ modalProps }) => {
  const max = new Date().toISOString().split("T")[0];
  const [bookPageCounts, pending, setPending, modalState, setModalState] =
    modalProps;

  const ref = useRef({
    readingStateEffect: false,
    privateNoteEffect: false,
  });
  const readingStateList = [
    "Currently reading",
    "Want to read",
    "Did not finish",
    "Read",
  ];

  const handleBookDatesForm = async () => {
    try {
      const res = await fetch(
        `/api/update-reader-book-dates/${modalState.bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startingDate: modalState.startingDate,
            finishingDate: modalState.finishingDate,
          }),
        }
      );
      if (!res.ok) {
        toast.error("Something went wrong");
        return;
      }
      const data = await res.json();
      toast.success("Book dates updated");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handlePageNumberForm = async () => {
    try {
      const res = await fetch(
        `/api/update-reader-page-number/${modalState.bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageNumber: modalState.pageNumber,
          }),
        }
      );
      if (!res.ok) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Page number updated");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleClose = () => {
    setModalState((prevState) => {
      return Object.keys(prevState).reduce((acc, curr) => {
        if (curr != "readingState") {
          acc[curr] = null;
        } else {
          acc[curr] = modalState.readingState;
        }
        return acc;
      }, {});
    });

    ref.current.privateNoteEffect = false;
    ref.current.readingStateEffect = false;
  };
  const getBookDetails = async () => {
    try {
      const res = await fetch(
        `/api/get-reader-book-modal-details/${modalState.bookId}`
      );
      if (!res.ok) {
        throw new Error(res);
      }
      const { readerBookModalDetails } = await res.json();

      if (readerBookModalDetails.length == 0) {
        setModalState((prevState) => {
          return Object.keys(prevState).reduce((acc, curr) => {
            if (curr == "show") {
              acc[curr] = true;
            } else {
              acc[curr] = null;
            }
            return acc;
          }, {});
        });
      } else {
        setModalState((prevState) => ({
          ...prevState,
          isClicked: false,
          show: true,
          bookId: readerBookModalDetails[0].id,
          readingState:
            readerBookModalDetails[0].Book_Reading_States[0].reading_state,
          prevReadingState:
            readerBookModalDetails[0].Book_Reading_States[0].reading_state,
          privateNote: readerBookModalDetails[0].Private_Notes[0].private_note,
          startingDate:
            readerBookModalDetails[0].Book_Reading_States[0].starting_date,
          finishingDate:
            readerBookModalDetails[0].Book_Reading_States[0].finishing_date,
          pageNumber:
            readerBookModalDetails[0].Book_Reading_States[0].page_number,
        }));
      }
      setPending(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const sendReadingState = async () => {
    try {
      const res = await fetch(`/api/set-reading-state/${modalState.bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          readingState: modalState.readingState,
        }),
      });
      if (!res.ok) {
        toast.error("Something went wrong");
        ref.current.readingStateEffect = false;
        setModalState((prevState) => ({
          ...prevState,
          readingState: prevState.prevReadingState,
        }));
        return;
      }
      toast.success("Reading state updated");
    } catch (error) {}
  };
  const sendPrivateNote = async () => {
    try {
      const privateNote =
        modalState.privateNote == null ? "" : modalState.privateNote.trim();

      const res = await fetch(`/api/set-private-note/${modalState.bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privateNote: privateNote,
        }),
      });

      if (!res.ok) {
        toast.error("Something went wrong");
        ref.current.privateNoteEffect = false;
      }

      toast.success("Private note updated");
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (ref.current.readingStateEffect && modalState.show) {
      const timeout = setTimeout(() => {
        sendReadingState();
      }, 200);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [modalState.readingState]);

  useEffect(() => {
    if (ref.current.privateNoteEffect && modalState.show) {
      const timeout = setTimeout(() => {
        sendPrivateNote();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [modalState.privateNote]);

  useEffect(() => {
    if (modalState.isClicked) {
      getBookDetails();
    }
  }, [modalState.isClicked]);

  return (
    <>
      <Modal show={modalState.show} onHide={handleClose} data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>Add to my booklist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            id="readingState"
            className="d-flex flex-wrap gap-2 justify-content-evenly"
          >
            {readingStateList.map((item) => {
              return (
                <Button
                  key={item}
                  id={item.replaceAll(" ", "-")}
                  variant={
                    modalState.readingState == item ? "primary" : "light"
                  }
                  onClick={() => {
                    ref.current.readingStateEffect = true;
                    setModalState((prevState) => ({
                      ...prevState,
                      readingState:
                        prevState.readingState == item ? null : item,
                      prevReadingState: prevState.readingState,
                    }));
                  }}
                >
                  {item}
                </Button>
              );
            })}
          </div>
          {modalState.readingState == "Currently reading" ? (
            <Form
              className="m-3"
              onSubmit={(e) => {
                e.preventDefault();
                handlePageNumberForm();
              }}
            >
              <Row>
                <Col xs={{ span: 9 }}>
                  <Form.Group>
                    <Form.Label>Where I left off</Form.Label>
                    <InputGroup>
                      <InputGroup.Text id="pageNumber">
                        {modalState.pageNumber}/
                        {bookPageCounts[modalState.bookId]}
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        id="pageNumberInp"
                        min="0"
                        max={bookPageCounts[modalState.bookId]}
                        aria-describedby="pageNumber"
                        onChange={(e) => {
                          setModalState((prevState) => ({
                            ...prevState,
                            pageNumber: e.target.value,
                          }));
                        }}
                      ></Form.Control>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col
                  xs={3}
                  className="d-flex justify-content-center align-items-end"
                >
                  <Button type="submit">Update</Button>
                </Col>
              </Row>
            </Form>
          ) : (
            ""
          )}
          {modalState.readingState == "Read" ? (
            <Form
              id="bookDates"
              className="d-flex flex-column gap-3 m-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleBookDatesForm();
              }}
            >
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      id="startingDate"
                      value={
                        modalState.startingDate != null
                          ? modalState.startingDate
                          : ""
                      }
                      max={max}
                      onChange={(e) =>
                        setModalState((prevState) => ({
                          ...prevState,
                          startingDate: e.target.value,
                        }))
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Finish Date</Form.Label>
                    <Form.Control
                      id="finishingDate"
                      type="date"
                      value={
                        modalState.finishingDate != null
                          ? modalState.finishingDate
                          : ""
                      }
                      max={max}
                      onChange={(e) =>
                        setModalState((prevState) => ({
                          ...prevState,
                          finishingDate: e.target.value,
                        }))
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 3 }}
                  className="d-flex justify-content-end ms-auto"
                >
                  <Button type="submit">Update</Button>
                </Col>
              </Row>
            </Form>
          ) : (
            ""
          )}
          <div className="fs-5">Private Note</div>
          <div className="d-flex gap-2 align-items-center mb-3">
            <FaLock />
            <span className="fst-italic text-body-secondary">
              This can be seen by only you
            </span>
          </div>
          <textarea
            name=""
            id="privateNote"
            placeholder="Your private note.."
            className="w-100 border-0 rounded-5 p-2"
            value={modalState.privateNote == null ? "" : modalState.privateNote}
            onChange={(e) => {
              setModalState((prevState) => ({
                ...prevState,
                privateNote: e.target.value,
              }));
              ref.current["privateNoteEffect"] = true;
            }}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Spinner pendingVal={pending} />
    </>
  );
};

export default ReaderBookModalDetails;
