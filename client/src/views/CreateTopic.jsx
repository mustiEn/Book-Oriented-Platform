import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";
import "../css/topic_category.css";
import BackNavigation from "../components/BackNavigation";
import RightSidebar from "../components/RightSidebar";

const CreateTopic = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [categoryCount, setCategoryCount] = useState(0);
  const [topic, setTopic] = useState({
    topic: "",
    // description: "",
    category: [],
  });

  const returnCategoryClassnames = (param) => {
    let classnames;
    if (categoryCount == 3) {
      if (topic.category.includes(param)) {
        classnames =
          "bg-white text-black topic-category-item rounded-5 py-1 px-2";
      } else {
        classnames =
          "bg-black bg-opacity-50 text-white text-opacity-50 topic-category-item-disabled rounded-5 py-1 px-2";
      }
    } else {
      if (topic.category.includes(param)) {
        classnames =
          "bg-white text-black topic-category-item rounded-5 py-1 px-2";
      } else {
        classnames =
          "bg-black text-white topic-category-item rounded-5 py-1 px-2";
      }
    }
    return classnames;
  };

  const handleSubmit = async () => {
    try {
      console.log(topic.category.length);

      if (topic.topic == "") {
        toast.error("Topic is required");
        throw new Error("Topic is required");
      }
      if (topic.category.length == 0) {
        toast.error("Category is required");
        throw new Error("Category is required");
      }
      const res = await fetch("/api/create-topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topic),
      });
      if (!res.ok) {
        toast.error("Something went wrong");
      }
      const data = await res.json();
      setCategoryCount(0);
      setTopic({
        topic: "",
        // description: "",
        category: [],
      });
      toast.success("Topic created successfully");
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <>
      <BackNavigation innerHtml={"Create Topic"} />
      <div id="topicContainer" className="w-100 p-4">
        <Form className="d-flex flex-column gap-3 mb-3" data-bs-theme="dark">
          <Form.Group controlId="formBasicTopic">
            <Form.Label className="fw-bold mb-1 fs-6">Topic</Form.Label>
            <Form.Control
              type="text"
              name="topic"
              value={topic.topic}
              onChange={(e) => {
                setTopic({
                  ...topic,
                  topic: e.target.value,
                });
              }}
            />
          </Form.Group>
        </Form>
        <div>Topic Categories</div>
        <div className="border px-2">
          <div
            className={
              categoryCount == 3 ? "text-end text-danger py-1" : "text-end py-1"
            }
          >
            {categoryCount}/3
          </div>
          <div className="d-flex flex-wrap gap-2 pb-2">
            {data.map((category) => (
              <div
                key={category.id}
                className={returnCategoryClassnames(category.topic_category)}
                style={{
                  fontSize: 13 + "px",
                }}
                onClick={() => {
                  if (topic.category.includes(category.topic_category)) {
                    setTopic(
                      (prevTopic) => ({
                        ...prevTopic,
                        category: prevTopic.category.filter(
                          (item) => item != category.topic_category
                        ),
                      })
                      // topic.category.filter(
                      //   (item) => item != category.topic_category
                      // )
                    );
                    setCategoryCount((prevState) => prevState - 1);
                  } else {
                    if (categoryCount == 3) return;
                    setTopic((prevTopic) => ({
                      ...prevTopic,
                      category: [
                        ...prevTopic.category,
                        category.topic_category,
                      ],
                    }));
                    setCategoryCount((currentState) => currentState + 1);
                  }
                }}
              >
                {category.topic_category}
              </div>
            ))}
          </div>
        </div>
        <Button variant="light" onClick={handleSubmit}>
          Share
        </Button>
      </div>
      <RightSidebar />
    </>
  );
};

export default CreateTopic;
