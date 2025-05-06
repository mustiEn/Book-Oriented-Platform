import moment from "moment";
import React from "react";
import { FaComment } from "react-icons/fa6";
import {
  useLoaderData,
  useOutletContext,
  useParams,
  Link,
} from "react-router-dom";
import PostQuote from "./PostQuote";

const ReaderProfileQuotes = () => {
  const data = useLoaderData();
  // const [, readerUsername] = useOutletContext();

  console.log(data);

  return (
    <>
      <ul id="quotes" className="d-flex flex-column gap-3">
        {data.readerQuotes.length > 0 ? (
          data.readerQuotes.map((quote) => {
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

export const loadReaderQuotes = async ({ params }) => {
  const { profile: username } = params;
  const response = await fetch(`/api/${username}/get-reader-quotes`);
  console.log(username);

  if (!response.ok) {
    toast.error("Something went wrong");
    throw new Error(response);
  }
  const data = await response.json();
  return data;
};
