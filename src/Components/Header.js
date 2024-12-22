import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <h2>File Submission Portal</h2>
      <nav>
        <Link to="/signup">Signup</Link> | <Link to="/signin">Signin</Link> | <Link to="/admin-signin">Are You an Admin?</Link>
      </nav>
    </header>
  );
};

export default Header;
