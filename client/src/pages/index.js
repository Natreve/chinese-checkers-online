import React from "react"
import { Router } from "@reach/router"
import Loadable from "@loadable/component"
import SEO from "components/seo"

const Home = Loadable(() => import("views/home"), {
  fallback: <div>Loading</div>,
})
const Tutorial = Loadable(() => import("views/tutorial"), {
  fallback: <div>Loading</div>,
})
const Game = Loadable(() => import("views/game"), {
  fallback: <div>Loading</div>,
})
const NotFound = Loadable(() => import("views/404"), {
  fallback: <div>404</div>,
})

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <Router basepath="/">
      <Home path="/" />
      <Tutorial path="tutorial" />
      <Game path="game" />
      <NotFound default />
    </Router>
  </>
)

export default IndexPage
