import React, { useEffect, useState } from "react";
import htmlParser from "html-react-parser";
import langConverter from "iso-639-1";
import countryConverter from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Link, useOutletContext } from "react-router-dom";

countryConverter.registerLocale(enLocale);

const BookDetailsAbout = () => {
  const data = useOutletContext();

  return (
    <>
      <div className="fw-bold fs-5">About</div>
      <br />
      <div className="book-description">
        {data.description ? htmlParser(data.description) : "No description"}
      </div>
      <hr />
      <div className="d-flex justify-content-start gap-4 flex-wrap">
        <div>
          <span className="fw-bold">Author:</span>
          {data.author == null ? "No author" : data.author}
        </div>
        <div>
          <span className="fw-bold">Publisher:</span>
          {data.publisher == null ? "No publisher" : data.publisher}
        </div>
        <div>
          <span className="fw-bold">Published Date:</span> {data.published_date}
        </div>
        <div>
          <span className="fw-bold">Language:</span>
          {langConverter.getName(data.language)}
        </div>
        <div>
          <span className="fw-bold">Category:</span>
          {data.category == null ? "No category" : data.category}
        </div>
        <div>
          <span className="fw-bold">Page Number:</span>
          {data.page_count == null ? "No page number" : data.page_count}
        </div>
        <div>
          <span className="fw-bold">Country:</span>
          {countryConverter.getName(data.country, "en")}
        </div>
        <div>
          <span className="fw-bold">PDF:</span>
          {data.pdf ? (
            <Link to={data.pdf}>Download Link</Link>
          ) : (
            "Not Available"
          )}
        </div>
      </div>
      <hr />
    </>
  );
};

export default BookDetailsAbout;

// export const loadBookStatistics = async ({ params }) => {
//   const { bookId } = params;
//   const response = await fetch(`/api/get-book-statistics/${bookId}`);
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(response);
//   }
//   return data;
// };
