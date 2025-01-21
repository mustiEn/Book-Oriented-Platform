import React, { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import BackNavigation from "../components/BackNavigation";
import Form from "react-bootstrap/Form";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import { TbHexagons } from "react-icons/tb";
import "../css/book_categories.css";
import InfiniteScroll from "react-infinite-scroll-component";

const BookCategories = () => {
  const [bookCategories, setBookCategories] = useState(useLoaderData());
  const location = useLocation();
  const navigation = useNavigation();
  const [searchQ, setSearchQ] = useState("");
  const [pending, setPending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dataIndex, setDataIndex] = useState(50);
  console.log(location);

  const getSearchedCategory = async () => {
    try {
      const res = await fetch(`/api/get-book-categories?q=${searchQ}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      console.log(data);
      setPending(false);
      setHasMore(data.length > 0 ? true : false);
      setBookCategories(data);
    } catch (error) {
      console.log(error);
      setPending(false);
      toast.error(error.message);
    }
  };

  const getMoreCategories = async () => {
    try {
      console.log(dataIndex);

      const res = await fetch(
        `/api/get-book-categories?q=${searchQ}&index=${dataIndex}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      console.log(data);
      setPending(false);
      setDataIndex(dataIndex + 50);
      setHasMore(data.length > 0 ? true : false);
      setBookCategories((prev) => [...prev, ...data]);
    } catch (error) {
      console.log(error);
      setPending(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getSearchedCategory();
      setPending(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQ]);

  useEffect(() => {
    if (navigation.state === "loading") {
      setPending(true);
    } else {
      setPending(false);
    }
  }, [navigation.state]);

  return (
    <>
      <BackNavigation innerHtml={"Book Categories"} />
      <Form.Control
        type="text"
        value={searchQ}
        onChange={(e) => setSearchQ(e.target.value)}
        placeholder="Search"
      />

      <InfiniteScroll
        dataLength={bookCategories.length}
        next={getMoreCategories}
        hasMore={hasMore}
        loader={<Spinner />}
      >
        <ul>
          {bookCategories.map((category) => (
            <li key={category.id} className="book-category p-2">
              <Link
                to={`${category.id}`}
                className="d-flex align-items-center gap-2"
                onClick={() => console.log("sad")}
              >
                <TbHexagons />
                <div>
                  <div className="fw-bold">{category.category}</div>
                  <div className="text-pale" style={{ fontSize: 13 + "px" }}>
                    {category.book_count} books
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

      <Spinner pending={pending} />
    </>
  );
};

export default BookCategories;
