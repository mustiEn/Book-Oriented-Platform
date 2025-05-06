import React, { Suspense, useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import PostReview from "../components/PostReview";
import PostThought from "../components/PostThought";
import PostQuote from "../components/PostQuote";
import Spinner from "../spinner/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const location = useLocation();
  const posts = useLoaderData();
  const [items, setItems] = useState(posts);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(20);
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
  const fetchMoreData = async () => {
    const response = await fetch(`/api/get-home-page-posts/${index}`);
    const posts = await response.json();

    if (!response.ok) {
      throw new Error(response);
    }

    setItems((prevItems) => [...prevItems, ...posts]);
    setIndex(index + 20);

    if (items.length >= 500) {
      setHasMore(false);
    }
    if (posts.length == 0) {
      setHasMore(false);
    }
  };

  return (
    <>
      <ul>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Spinner />}
        >
          {items.map((post, i) => {
            return (
              <li key={i} className="post p-3">
                {returnComponent(post)}
                <hr />
              </li>
            );
          })}
        </InfiniteScroll>
      </ul>
    </>
  );
};

export default Home;
