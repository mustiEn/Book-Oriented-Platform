import React, { useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import {
  createSearchParams,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import PostReview from "./PostReview";
import PostThought from "./PostThought";
import PostQuote from "./PostQuote";

const TopicPosts = () => {
  const { posts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const q = searchParams.get("q");
  const location = useLocation();
  const navigation = useNavigation();

  const [activeBtns, setActiveBtns] = useState("The newest");
  const [pending, setPending] = useState(false);
  const { topicName } = params;
  const returnComponent = (post) => {
    let component;
    if (post.review) {
      component = <PostReview data={post} />;
    } else if (post.thought) {
      component = <PostThought data={post} />;
    } else {
      component = <PostQuote data={post} />;
    }
    return component;
  };

  useEffect(() => {
    if (navigation.state === "loading") {
      setPending(true);
    } else {
      setPending(false);
    }
  }, [navigation.state]);

  useEffect(() => {
    setActiveBtns("The newest");
  }, [q]);

  return (
    <>
      {posts.length > 0 ? (
        <>
          <div className="d-flex align-items-center px-3 gap-2">
            <DropdownButton
              variant="outline-light"
              id="dropdown-basic"
              size="sm"
              title={activeBtns}
            >
              <Dropdown.Item
                as={Link}
                to={`${location.pathname}${
                  searchParams.get("q")
                    ? "?q=" + searchParams.get("q") + "&sortBy=newest"
                    : "?sortBy=newest"
                }`}
                onClick={() => {
                  setActiveBtns("The newest");
                }}
              >
                The newest
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to={`${location.pathname}${
                  searchParams.get("q")
                    ? "?q=" + searchParams.get("q") + "&sortBy=oldest"
                    : "?sortBy=oldest"
                }`}
                onClick={() => setActiveBtns("The oldest")}
              >
                The oldest
              </Dropdown.Item>
            </DropdownButton>
            <NavLink
              className={({ isActive }) =>
                !q && isActive
                  ? "btn btn-sm btn-light"
                  : "btn btn-sm btn-outline-light"
              }
              to={`/topic/${topicName}/posts`}
            >
              All
            </NavLink>
            <NavLink
              to={`/topic/${topicName}/posts?q=review`}
              className={({ isActive }) =>
                q === "review" && isActive
                  ? "btn btn-sm btn-light"
                  : "btn btn-sm btn-outline-light"
              }
            >
              Reviews
            </NavLink>
            <NavLink
              to={`/topic/${topicName}/posts?q=thought`}
              className={({ isActive }) =>
                q === "thought" && isActive
                  ? "btn btn-sm btn-light"
                  : "btn btn-sm btn-outline-light"
              }
            >
              Thoughts
            </NavLink>
            <NavLink
              to={`/topic/${topicName}/posts?q=quote`}
              className={({ isActive }) =>
                q === "quote" && isActive
                  ? "btn btn-sm btn-light"
                  : "btn btn-sm btn-outline-light"
              }
            >
              Quotes
            </NavLink>
          </div>
          <ul className="px-3">
            {posts.map((post) => {
              return (
                <li key={post.id} className="post p-3">
                  {returnComponent(post)}
                  <hr />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="fs-5 px-3">No posts yet</div>
      )}

      <Spinner pendingVal={pending} />
    </>
  );
};

export default TopicPosts;
