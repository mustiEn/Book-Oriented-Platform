import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <>
      <div>Error</div>
      <div>Oops, {error.message}</div>
    </>
  );
};

export default Error;
// https://www.reddit.com/r/AteistTurk/comments/p5eqxc/174_%C3%A7eli%C5%9Fkiyi_bi_araya_getirdim_devam_ettirmek/?rdt=39670
