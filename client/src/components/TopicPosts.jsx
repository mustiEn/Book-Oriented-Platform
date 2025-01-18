import React, { useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import LoadingSpinner from "../spinner/Spinner";

const TopicPosts = () => {
  const params = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("sortBy");
  const [activeBtns, setActiveBtns] = useState({
    sortBy: q ? "The oldest" : "The newest",
  });
  const [pending, setPending] = useState(false);
  const { topicName } = params;
  const prevQRef = useRef(q);

  console.log(location, q);

  const getPosts = async () => {
    try {
      const res = await fetch(
        `/api/get-topic-posts/${topicName}/${activeBtns.post}${
          location.search ?? "all"
        }`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(res);
      }
      setPending(false);
    } catch (error) {
      console.log(error);
      setPending(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (prevQRef.current !== q) {
      setActiveBtns((prev) => ({
        ...prev,
        sortBy: q ? "The oldest" : "The newest",
      }));

      const timer = setTimeout(() => {
        setPending(true);
        getPosts();
      }, 200);
      prevQRef.current = q;
      return () => clearTimeout(timer);
    }
  }, [q]);

  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <DropdownButton
          variant="outline-light"
          id="dropdown-basic"
          size="sm"
          title={activeBtns.sortBy}
        >
          <Dropdown.Item
            as={Link}
            to={`${location.pathname}`}
            onClick={() =>
              setActiveBtns((prev) => ({ ...prev, sortBy: "The newest" }))
            }
          >
            The newest
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to={`${location.pathname}?sortBy=oldest`}
            onClick={() =>
              setActiveBtns((prev) => ({ ...prev, sortBy: "The oldest" }))
            }
          >
            The oldest
          </Dropdown.Item>
        </DropdownButton>
        <NavLink
          className="btn btn-sm btn-outline-light"
          to={`/topic/${topicName}/posts`}
          end
        >
          All
        </NavLink>
        <NavLink
          className="btn btn-sm btn-outline-light"
          to={`/topic/${topicName}/posts/review`}
        >
          Reviews
        </NavLink>
        <NavLink
          className="btn btn-sm btn-outline-light"
          to={`/topic/${topicName}/posts/thought`}
        >
          Thoughts
        </NavLink>
        <NavLink
          className="btn btn-sm btn-outline-light"
          to={`/topic/${topicName}/posts/quote`}
        >
          Quotes
        </NavLink>
      </div>
      <Outlet />
      <LoadingSpinner pendingVal={pending} />
    </>
  );
};

export default TopicPosts;
