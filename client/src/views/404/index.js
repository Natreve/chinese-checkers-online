import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>Ooop...</h1>
    <p>
      You just hit a route that doesn&#39;t exist... the sadness.{" "}
      <span role="img" aria-label="sad face">
        🤕
      </span>
    </p>
  </Layout>
)

export default NotFoundPage
