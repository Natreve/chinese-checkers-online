import React from "react";
import css from "./css.module.scss";

const Layout = ({ children }) => {
  return (
    <div className={css.container}>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built by
        {` `}
        <a href="https://andrewgray.dev" style={{textDecoration:"none"}}>
          Andrew Gray with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
        </a>
      </footer>
    </div>
  );
};

export default Layout;
