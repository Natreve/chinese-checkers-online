import React from "react"
import css from "./css.module.scss"

const Button = props => {
  return (
    <button className={css.button} onClick={e => props.onClick(e)}>
      {props.children}
    </button>
  )
}
export default Button
