import React, { useEffect, useState } from "react"
import { Router } from "@reach/router"
import GameBoard from "components/game"
import Layout from "components/layout"
import Loading from "components/loading"
// import { socket, joinGame } from "services/Socket.io"
import css from "./css.module.scss"
const Game = () => {
  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("connected", socket.connected)
    // })
    // return () => socket.disconnect()
  }, [])

  return (
    <Layout>
      <Router basepath="/game">
        {/* <GameBoard path="/" /> */}
        <Register path="/register" />
        <JoinGame path="/join/:gameID" />
        <CreateGame path="/create" />
      </Router>
    </Layout>
  )
}
const Register = () => {}
const JoinGame = props => {
  const [gameStatus, setGameStatus] = useState("joining")
  useEffect(() => {
    if (false) setGameStatus("hello")
  }, [])

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
    case "start":
      return <GameBoard path="/" />
    default:
      break
  }
}
const CreateGame = () => <div>Create Game</div>

export default Game
