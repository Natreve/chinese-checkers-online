import { Link } from "gatsby"
import React from "react"
const Header = ({ siteTitle }) => (
  <header>
    <div
      style={{
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <Link
        to="/"
        style={{
          color: `#505457`,
          textDecoration: `none`,
        }}
      >
        {siteTitle}
      </Link>
    </div>
  </header>
)

export default Header
