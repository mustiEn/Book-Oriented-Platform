import React from "react";
import { useRouteError } from "react-router";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <>
      <div id="error-page" className="text-center mt-5 mx-auto">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
};

export default Error;
// https://www.reddit.com/r/AteistTurk/comments/p5eqxc/174_%C3%A7eli%C5%9Fkiyi_bi_araya_getirdim_devam_ettirmek/?rdt=39670
