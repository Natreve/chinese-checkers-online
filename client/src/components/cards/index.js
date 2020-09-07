import React from "react"
import css from "./css.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
const RadioCard = props => {
  return (
    <label className={css.radio}>
      <input
        type="radio"
        name={props.name}
        checked={props.checked}
        onChange={props.onChange ? e => props.onChange(e.target.value) : null}
        value={props.value}
      />
      <div className={[css.card, css.body].join(" ")}>
        <div className={css.header}>
          <span role="img" aria-label="controller">
            🎮
          </span>
          {props.value}
        </div>
        <div className={css.subHeader}>Players</div>
        <FontAwesomeIcon icon={faCheckCircle} color="#505457" />
      </div>
    </label>
  )
}
export { RadioCard }
