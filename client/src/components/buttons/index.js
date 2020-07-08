import React from "react"
import PropTypes from "prop-types"
import css from "./css.module.scss"

const Button = props => {
  return (
    <button
      form={props.form}
      className={css.button}
      onClick={e => props.onClick(e)}
    >
      {props.children}
    </button>
  )
}
Button.prototype = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  form: PropTypes.string,
  onClick: PropTypes.func,
}
Button.defaultProps = {
  disabled: false,
  loading: false,
  form: ``,
  onClick: () => null,
}

export default Button
