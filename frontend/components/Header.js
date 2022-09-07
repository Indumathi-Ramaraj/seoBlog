import React, { useState, useEffect } from "react";
import { APP_NAME } from "../config";
import Link from "next/link";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { isAuth, signout } from "../actions/auth";
import Router from "next/router";

const Header = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(isAuth());
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {!auth && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{ cursor: "pointer" }}>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Signup</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {auth && (
              <React.Fragment>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    onClick={() => signout(() => Router.replace(`/signin`))}
                  >
                    Signout
                  </NavLink>
                </NavItem>
              </React.Fragment>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
