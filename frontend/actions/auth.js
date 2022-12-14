import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import { API } from "../config";

export const signup = (user) => {
  return fetch(`${API}/api/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch(`${API}/api/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();

  return fetch(`${API}/signout`, {
    method: "GET",
  })
    .then((response) => {
      console.log("signout success");
    })
    .catch((err) => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {
  if (typeof window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key) => {
  if (typeof window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};
// get cookie
export const getCookie = (key) => {
  if (typeof window !== "undefined") {
    return cookie.get(key);
  }
};
// localstorage
export const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
  setCookie("token", data.token);
  setLocalStorage("user", data.user);
  next();
};

export const isAuth = () => {
  if (typeof window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
  return false;
};
