import React from "react"
import css from "./css.module.scss"

const Loading = () => {
  return (
    <div className={css.loadingBro}>
      <svg className={css.load} x="0px" y="0px" viewBox="0 0 150 150">
        <circle className={css.loadingInner} cx="75" cy="75" r="60" />
      </svg>
    </div>
  )
}
export default Loading
