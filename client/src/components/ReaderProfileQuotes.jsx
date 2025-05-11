import React from "react";
import { useLoaderData } from "react-router-dom";
import PostQuote from "./PostQuote";

const ReaderProfileQuotes = () => {
  const { readerQuotes } = useLoaderData();

  return (
    <>
      <ul id="quotes" className="d-flex flex-column gap-3">
        {readerQuotes.length > 0 ? (
          readerQuotes.map((quote) => {
            return (
              <li key={quote.id} className="quote p-3">
                <PostQuote data={quote} />
                <hr />
              </li>
            );
          })
        ) : (
          <div>No quotes found</div>
        )}
      </ul>
    </>
  );
};

export default ReaderProfileQuotes;
