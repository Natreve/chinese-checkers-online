import React from "react"
import css from "../css.module.scss"
import { Link } from "gatsby"
import { RadioCard } from "components/cards"
const CreateGame = props => {
  return (
    <section className={css.section}>
      <h1>Welcome, {props.user.username}</h1>
      <p>How many players do you want to play with?</p>

      <RadioCard
        name="playerCount"
        value={1}
        onChange={value => onSelect(value)}
      />
      <RadioCard
        name="playerCount"
        value={2}
        onChange={value => onSelect(value)}
      />
      <RadioCard
        name="playerCount"
        value={3}
        onChange={value => onSelect(value)}
      />
      <RadioCard
        name="playerCount"
        value={5}
        onChange={value => onSelect(value)}
      />

      <Link to="/">Back to Home</Link>
    </section>
  )
  function onSelect(value) {
    console.log(value)
  }
}
export default CreateGame
