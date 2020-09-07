import React, { useEffect } from "react"
import { navigate } from "gatsby"
import Carousel from "components/carousel"
import css from "./css.module.scss"
import Button from "components/buttons"
import Layout from "components/layout"

const Home = () => {
  useEffect(() => {})
  return (
    <Layout maxWidth="100%">
      <Carousel>
        <section className={css.slide}>
          <h1>Learn to play</h1>
          <p>
            Online and Offline multiplayer boardgame to play with up to (1, 2
            ,3, 5) of your friends! In the classic chinese checkers strategy
            board game.
          </p>
          <Button onClick={() => onClick("tutorial")}>HOW TO PLAY</Button>
        </section>
        <section className={css.slide}>
          <h1>Play with others</h1>
          <p>
            Play against up to 5 random players online in a competive match to
            see who is the real chinese checkers strategy board game master.
          </p>
          <Button onClick={() => onClick("joinGame")}>JOIN GAME</Button>
        </section>
        <section className={css.slide}>
          <h1>Make your own</h1>
          <p>
            Create your own game to play with friends and family offiline or
            share your game link with friends and see who’s been practicing!{" "}
          </p>
          <Button onClick={() => onClick("createGame")}>CREATE GAME</Button>
        </section>
      </Carousel>
    </Layout>
  )
  function onClick(action) {
    switch (action) {
      case "tutorial":
        navigate("/tutorial")
        break
      case "joinGame":
        navigate("/game/join")
        break
      case "createGame":
        navigate("/game/create")
        break

      default:
        break
    }
  }
}
export default Home
