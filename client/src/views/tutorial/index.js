import React from "react"
import { navigate } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import Carousel from "components/carousel"
import Layout from "components/layout"
import Header from "components/header"
import Button from "components/buttons"
import css from "./css.module.scss"
const Tutorial = () => {
  return (
    <Layout
      header={
        <Header
          siteTitle={
            <>
              <FontAwesomeIcon icon={faChevronLeft} color="#505457" /> BACK
            </>
          }
        />
      }
    >
      <Carousel>
        <div className={css.slide}>
          <p>
            The objective of the game is to be the first player to move all of
            your 10 pieces accross the board into the opposite triangle.
          </p>
          <p>
            The first player to occupy all 10 destitation triangle is the
            winner.
          </p>
        </div>
        <div className={css.slide}>
          <p>
            Players can only move their pieces to an adjacent space or hop an
            adjacent piece to a empty space directly to the other side. You are
            allowed to chain together multiple hops
          </p>
          <p>
            You can only move your pieces within your destination triangle or
            your own triangle, you can also hop through other triangles so long
            has your piece doesn’t land within it.
          </p>
          <p>
            Once your piece is within your destination triangle you can only
            move it with in.
          </p>
        </div>
        <div className={css.slide}>
          <p>
            If one or more of the destination holes contain a piece belonging to
            another player this does not prevent a player from winning.
          </p>
          <p>
            The game is simply won when all the available spots within the
            triangle are accupted with your pieces
          </p>
          <Button onClick={() => onClick("joinGame")}>JOIN GAME</Button>

          <br />
          <Button onClick={() => onClick("createGame")}>CREATE GAME</Button>
        </div>
      </Carousel>
    </Layout>
  )
  function onClick(action) {
    switch (action) {
      case "joinGame":
        navigate("/game/join")
        break
      case "createGame":
        navigate("/game/create")
        break

      default:
        break
    }
    console.log(action)
  }
}
export default Tutorial
