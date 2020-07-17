import React, { useEffect, useState } from "react"
import Loadable from "@loadable/component"
import { Link } from "gatsby"
import localforge from "localforage"
import firebase from "gatsby-plugin-firebase"
import GameBoard from "components/game"
import Layout from "components/layout"
import Loading from "components/loading"
import css from "./css.module.scss"

const Game = props => {
  const [screen, setScreen] = useState(<Loading />)
  const action = props.action

  useEffect(() => {
    localforge.getItem("user", (err, user) => {
      if (!user) {
        setScreen(<CreateUsername />)
      } else {
        switch (action) {
          case "join":
            setScreen(<JoinGame user={user} />)
            break
          case "create":
            setScreen(<CreateGame user={user} />)
            break
          case "create-username":
            setScreen(<CreateUsername user={user} />)
            break
          default:
            setScreen(<GameBoard user={user} />)
            break
        }
      }
    })
  }, [action])

  return <Layout>{screen}</Layout>
}
const CreateUsername = Loadable(() => import("views/create-username"), {
  fallback: <Loading />,
})
const JoinGame = props => {
  const [gameStatus, setGameStatus] = useState("joining")
  const user = props.user
  const firestore = firebase.firestore()
  if (process.env.NODE_ENV === "development") {
    console.log(firestore.app.options)
    firestore.settings({
      host: "localhost:8080",
      ssl: false,
    })
  }
  useEffect(() => {
    joinGame()
    async function joinGame() {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "joinGame", user: user }),
      })
      const game = await response.json()
      firestore
        .collection("games")
        .doc(game.gameID)
        .onSnapshot(async function (doc) {
          setGameStatus(doc.data().config.status)
        })
    }
  }, [firestore, user])
  switch (gameStatus) {
    case "joining":
      return (
        <section className={css.section}>
          <h1>Joining Game...</h1>
          <p>
            We’re search for an available game, this shouldn’t take too long.
          </p>
          <Loading />
        </section>
      )
    case "queued":
      return (
        <section className={css.section}>
          <h1>Waiting on players...</h1>
          <p>
            We’ve found a game, we’re waiting on other players to join, this
            shouldn’t take long either
          </p>
          <Loading />
        </section>
      )
    case "started":
      return <GameBoard user={user} />
    default:
      break
  }
}
const CreateGame = () => (
  <section className={css.section}>
    <h1>Create Game...</h1>
    <p>
      This feature is currently under
      <span role="img" aria-label="construction">
        {" "}
        🚧 👷
      </span>
      , will enable soon in the meantime try joining a game.
    </p>
    <Link to="/">Back to Home</Link>
  </section>
)

export default Game
