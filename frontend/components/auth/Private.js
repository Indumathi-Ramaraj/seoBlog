import React, { useEffect, useState } from "react";
import Router from "next/router";
import { isAuth } from "../../actions/auth";

console.log("AuthPrivate......", isAuth());

const Private = ({ children }) => {
  useEffect(() => {
    if (!isAuth()) {
      Router.push(`/signin`);
    }
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default Private;
