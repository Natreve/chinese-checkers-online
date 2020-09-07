import React, { useEffect, useState } from "react"
import Loadable from "@loadable/component"
import localforge from "localforage"
import firebase from "gatsby-plugin-firebase"
import GameBoard from "components/game"
import Layout from "components/layout"
import Loading from "components/loading"
import css from "./css.module.scss"

const CreateGame = Loadable(() => import("./create"))
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

  return screen
}
const CreateUsername = Loadable(() => import("views/create-username"), {
  fallback: <Loading />,
})
const JoinGame = props => {
  const [gameStatus, setGameStatus] = useState("joining")
  const [game, setGame] = useState(null)
  const user = props.user
  const firestore = firebase.firestore()
  if (process.env.NODE_ENV === "development") {
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
      const data = await response.json()
      firestore
        .collection("games")
        .doc(data.gameID)
        .onSnapshot(async function (doc) {
          if (doc.data()) {
            setGame(doc.data())
            setGameStatus(doc.data().config.status)
          }
        })
    }
  }, [firestore, user])
  switch (gameStatus) {
    case "joining":
      return (
        <Layout maxWidth="100%">
          <section className={css.section}>
            <h1>Joining Game...</h1>
            <p>
              We’re search for an available game, this shouldn’t take too long.
            </p>
            <Loading />
          </section>
        </Layout>
      )
    case "queued":
      return (
        <Layout maxWidth="100%">
          <section className={css.section}>
            <h1>Waiting on players...</h1>
            <p>
              We’ve found a game, we’re waiting on other players to join, this
              shouldn’t take long either
            </p>
            <Loading />
          </section>
        </Layout>
      )
    case "started":
      return (
        <Layout>
          <GameBoard user={user} game={game} />
        </Layout>
      )
    default:
      break
  }
}

export default Game
