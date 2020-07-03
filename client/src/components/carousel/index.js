import PropTypes from "prop-types"
import React from "react"
import Slider from "react-slick"
import css from "./css.module.scss"

const Carousel = ({ children }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // centerPadding: "140px",
    autoplay: false,
    arrows: false,
    // centerMode: true,
  }
  return (
    <div className={css.container}>
      <Slider {...settings}>{children}</Slider>
    </div>
  )
}
Carousel.propTypes = {
  children: PropTypes.node.isRequired,
}
export default Carousel
