import React from "react"
import PropTypes from "prop-types"
import Footer from "../footer"
import "./layout.scss"

const Layout = props => {
  

  return (
    <>
      {props.header}
      <div className="container" style={{maxWidth:props.maxWidth}}>
        <main>{props.children}</main>
      </div>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
