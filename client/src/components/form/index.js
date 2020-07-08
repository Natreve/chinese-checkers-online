import React, { useEffect } from "react"
import PropTypes from "prop-types"
import css from "./css.module.scss"

const Form = props => {
  useEffect(() => {})
  return (
    <form
      id={props.id}
      onSubmit={props.onSubmit}
      style={{ marginBottom: 50 }}
      autoComplete="off"
    >
      {props.children}
    </form>
  )
}
const InputField = props => {
  return (
    <div className={css.field}>
      <label htmlFor={props.name}>
        <h1>{props.label}</h1>
        <input
          autoComplete="off"
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          defaultValue={props.value}
          onChange={e =>
            props.onChange ? props.onChange(e.target.value, props.value) : null
          }
        />
      </label>
    </div>
  )
}
Form.propTypes = {
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
Form.defaultProps = {
  id: `form`,
  onSubmit: e => e.preventDefault(),
}
InputField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}

InputField.defaultProps = {
  placeholder: `placeholder`,
  value: "",
}
export { Form, InputField }
