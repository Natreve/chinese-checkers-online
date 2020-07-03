import React from "react"
import css from "./css.module.scss"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
const Footer = () => {
  return (
    <footer className={css.footer}>
      <a
        rel="noreferrer"
        target="_blank"
        href="https://github.com/Natreve/chinese-checkers-online"
      >
        <FontAwesomeIcon icon={faGithub} color="#505457" />
      </a>
    </footer>
  )
}
export default Footer
