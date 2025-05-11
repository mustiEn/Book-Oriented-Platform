import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useSearchParams,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  FaBookOpen,
  FaSort,
  FaShapes,
  FaClock,
  FaUserPen,
} from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "../spinner/Spinner";

const ReaderProfileBookshelf = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [childDataLength, setChildDataLength] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeQuery, setActiveQuery] = useState({
    sort: "",
    category: "",
    author: "",
    year: "",
  });
  const q = searchParams.get("q");
  const readerJoinedYear = useOutletContext();
  const { profile: readerUsername } = useParams();

  const yearsArr = ["All times", readerJoinedYear];
  const options = [
    "Read",
    "Currently reading",
    "Want to read",
    "Did not finish",
    "Liked",
  ];
  const querySortDict = [
    { sortBy: "Title" },
    { sortBy: "Published Date" },
    { sortBy: "Page Count" },
  ];

  useEffect(() => {
    console.log(activeQuery);
    if (new Date().getFullYear() != readerJoinedYear) {
      Array.from(
        { length: new Date().getFullYear() - readerJoinedYear },
        (_, year) => yearsArr.push(new Date().getFullYear() - year)
      );
    }
  }, []);

  return (
    <>
      <div
        className={
          childDataLength > 0
            ? "d-flex justify-content-evenly flex-wrap gap-2 mb-3"
            : "d-flex gap-2 mb-3"
        }
      >
        <NavLink
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-light" : "btn btn-sm btn-outline-light"
          }
          to={`/${readerUsername}/bookshelf`}
          onClick={() => setIsLoading(true)}
        >
          Overview
        </NavLink>

        {q != null ? (
          <>
            <Dropdown data-bs-theme="dark">
              <Dropdown.Toggle
                variant="outline-light"
                id="dropdown-basic"
                size="sm"
              >
                <FaBookOpen className="mb-1" /> {q}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {options.map((option, i) => (
                  <Dropdown.Item
                    key={`dropdown-${i}`}
                    as={Link}
                    to={`/${readerUsername}/bookshelf/books?q=${encodeURIComponent(
                      option
                    )}`}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {childDataLength > 0 ? (
              <>
                <DropdownButton
                  variant="outline-light"
                  id="dropdown-sort"
                  size="sm"
                  title={
                    <>
                      <FaSort className="mb-1" /> Sort
                      {activeQuery.sort != "" ? `: ${activeQuery.sort}` : ""}
                    </>
                  }
                >
                  {querySortDict.map((sort) => (
                    <Dropdown.Item
                      key={`dropdown-sort-${sort.sortBy}`}
                      as={Link}
                      to={`/${readerUsername}/bookshelf/books?q=${q}&sort=${encodeURIComponent(
                        sort.sortBy
                      )}`}
                      onClick={() =>
                        setActiveQuery((prev) => ({
                          ...Object.keys(prev).reduce(
                            (acc, key) => ({
                              ...acc,
                              [key]: "",
                            }),
                            {}
                          ),
                          sort: sort.sortBy,
                        }))
                      }
                    >
                      {sort.sortBy}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Dropdown data-bs-theme="dark">
                  <Dropdown.Toggle
                    variant="outline-light"
                    id="dropdown-category"
                    size="sm"
                  >
                    <FaShapes className="mb-1" /> Category
                    {activeQuery.category != ""
                      ? `: ${activeQuery.category}`
                      : ""}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categories.map((category, i) => (
                      <Dropdown.Item
                        key={`dropdown-category-${i}`}
                        as={Link}
                        to={`/${readerUsername}/bookshelf/books?q=${q}&category=${encodeURIComponent(
                          category.category
                        )}`}
                        onClick={() =>
                          setActiveQuery((prev) => ({
                            ...Object.keys(prev).reduce(
                              (acc, key) => ({
                                ...acc,
                                [key]: "",
                              }),
                              {}
                            ),
                            category: category.category,
                          }))
                        }
                      >
                        {category.category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown data-bs-theme="dark">
                  <Dropdown.Toggle
                    variant="outline-light"
                    id="dropdown-author"
                    size="sm"
                  >
                    <FaUserPen className="mb-1" /> Author
                    {activeQuery.author != "" ? `: ${activeQuery.author}` : ""}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {authors.map((author, i) => (
                      <Dropdown.Item
                        key={`dropdown-author-${i}`}
                        as={Link}
                        to={`/${readerUsername}/bookshelf/books?q=${q}&author=${encodeURIComponent(
                          author.author
                        )}`}
                        onClick={() =>
                          setActiveQuery((prev) => ({
                            ...Object.keys(prev).reduce(
                              (acc, key) => ({
                                ...acc,
                                [key]: "",
                              }),
                              {}
                            ),
                            author: author.author,
                          }))
                        }
                      >
                        {author.author}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown data-bs-theme="dark">
                  <Dropdown.Toggle
                    variant="outline-light"
                    id="dropdown-years"
                    size="sm"
                  >
                    <FaClock className="mb-1" /> Years
                    {activeQuery.year != "" ? `: ${activeQuery.year}` : ""}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {yearsArr.map((year, i) => (
                      <Dropdown.Item
                        as={Link}
                        key={`dropdown-year-${i}`}
                        to={`/${readerUsername}/bookshelf/books?q=${q}&year=${year}`}
                        onClick={() =>
                          setActiveQuery((prev) => ({
                            ...Object.keys(prev).reduce(
                              (acc, key) => ({
                                ...acc,
                                [key]: "",
                              }),
                              {}
                            ),
                            year: year,
                          }))
                        }
                      >
                        {year}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          <ul className="d-flex gap-2">
            {options.map((option, index) => {
              return (
                <li key={index}>
                  <NavLink
                    className="btn btn-sm btn-outline-light"
                    to={`/${readerUsername}/bookshelf/books?q=${encodeURIComponent(
                      option
                    )}`}
                    onClick={() => setIsLoading(true)}
                  >
                    {option.replaceAll("-", " ")}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Outlet
        context={{
          setIsLoading,
          setChildDataLength,
          setCategories,
          setAuthors,
        }}
      />
      {isLoading ? (
        <Spinner
          animation="border"
          role="status"
          className="position-fixed top-50 end-50 start-50"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        ""
      )}
    </>
  );
};

export default ReaderProfileBookshelf;
