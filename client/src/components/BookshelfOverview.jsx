import React, { useState, useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import "./bookshelf_overview.css";

const BookshelfOverview = () => {
  const data = useLoaderData();
  const { setIsLoading } = useOutletContext();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-3 bg-light text-black ">
          <p>{`Month: ${label}`}</p>
          <p>{`Read books: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  // console.log(data);

  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  return (
    <>
      <div>
        <ResponsiveContainer width="95%" height={350}>
          <LineChart data={data.yearlyReadBooks}>
            <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="MONTH" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
        <div className="read-books-per-author">
          <h5>Read books per authors</h5>
          <br />
          <ul>
            {data.readBooksPerAuthor.map((item, i) => {
              return (
                <li key={`list1-${i}`} className="d-flex gap-3">
                  <div>{item.author}</div>
                  <div>{item.quantity}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="read-books-per-category">
          <h5>Read books per category</h5>
          <br />
          <ul>
            {data.readBooksPerCategory.map((item, i) => {
              return (
                <li key={`list2-${i}`} className="d-flex gap-3">
                  <div>{item.category}</div>
                  <div>{item.quantity}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BookshelfOverview;


