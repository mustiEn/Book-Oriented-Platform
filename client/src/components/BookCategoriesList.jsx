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
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";
import { TbHexagons } from "react-icons/tb";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../css/book_categories.css";
import InfiniteScroll from "react-infinite-scroll-component";
import RightSidebar from "./SidebarRight";

const BookCategoriesList = () => {
  const categories = useLoaderData();
  const [bookCategories, setBookCategories] = useState(categories);
  const location = useLocation();
  const navigation = useNavigation();
  const [searchQ, setSearchQ] = useState("");
  const [pending, setPending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dataIndex, setDataIndex] = useState(50);

  const getSearchedCategory = async () => {
    try {
      const res = await fetch(`/api/get-book-categories?q=${searchQ}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setPending(false);
      setHasMore(data.length > 0 ? true : false);
      setDataIndex(50);
      setBookCategories(data);
    } catch (error) {
      setPending(false);
      toast.error(error.message);
    }
  };

  const getMoreCategories = async () => {
    try {
      const res = await fetch(
        `/api/get-book-categories?q=${searchQ}&index=${dataIndex}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      setPending(false);
      setDataIndex(dataIndex + 50);
      setHasMore(data.length > 0 ? true : false);
      setBookCategories((prev) => [...prev, ...data]);
    } catch (error) {
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
      <div className="px-2">
        <Form data-bs-theme="dark" className="my-2">
          <InputGroup>
            <InputGroup.Text>
              <FaMagnifyingGlass />
            </InputGroup.Text>
            <Form.Control
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search"
            />
          </InputGroup>
        </Form>
        <InfiniteScroll
          dataLength={bookCategories.length}
          next={getMoreCategories}
          hasMore={hasMore}
          loader={<Spinner />}
        >
          <ul>
            {bookCategories.map((category) => (
              <li key={category.id} className="p-2">
                <Link
                  key={category.id}
                  to={`${category.id}`}
                  className="d-flex align-items-center book-category gap-2 px-1"
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
      </div>
      <Spinner pending={pending} />
    </>
  );
};

export default BookCategoriesList;
