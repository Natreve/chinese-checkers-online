module.exports = {
  siteMetadata: {
    title: `Chinese Checkers online`,
    description: `A online version of Sternhalma or Tiaoqi (Chinese: 跳棋), commonly known as Chinese Checkers (US and Canadian spelling) or Chinese Chequers (UK spelling), is a strategy board game of German origin which can be played by two, three, four, or six people, playing individually or with partners. The game is a modern and simplified variation of the game Halma.
    The objective is to be first to race all of one's pieces across the hexagram-shaped board into "home"—the corner of the star opposite one's starting corner—using single-step moves or moves that jump over other pieces. The remaining players continue the game to establish second-, third-, fourth-, fifth-, and last-place finishers. The rules are simple, so even young children can play.`,
    author: `@andrewgray`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chinese Checkers Online`,
        short_name: `Chinese Checkers`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
