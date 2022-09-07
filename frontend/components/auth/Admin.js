import React, { useEffect, useState } from "react";
import Router from "next/router";
import { isAuth } from "../../actions/auth";

console.log("AuthAdmin......", isAuth());

const Admin = ({ children }) => {
  useEffect(() => {
    if (!isAuth()) {
      Router.push(`/signin`);
    } else if (isAuth().role !== 1) {
      Router.push(`/`);
    }
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default Admin;
