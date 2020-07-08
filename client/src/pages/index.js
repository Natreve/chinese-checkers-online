import React from "react"
import { Router } from "@reach/router"
import Loadable from "@loadable/component"
import SEO from "components/seo"
import Loading from "components/loading"
const Home = Loadable(() => import("views/home"), {
  fallback: <Loading />,
})
const Tutorial = Loadable(() => import("views/tutorial"), {
  fallback: <Loading />,
})
const Game = Loadable(() => import("views/game"), {
  fallback: <Loading />,
})
const NotFound = Loadable(() => import("views/404"), {
  fallback: <Loading />,
})

const IndexPage = () => {
  return (
    <>
      <SEO title="Home" />
      <Router basepath="/">
        <Home path="/" />
        <Tutorial path="tutorial" />
        <Game path="game/:action" />
        <NotFound default />
      </Router>
    </>
  )
}

export default IndexPage
