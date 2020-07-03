import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import Carousel from "components/carousel"
import Layout from "components/layout"
import Header from "components/header"
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
        <div className={css.container}>
          <div className={css.instructions}>
            <p>
              The objective of the game is to be the first player to move all of
              your 10 pieces accross the board into the opposite triangle.
            </p>
            <p>
              The first player to occupy all 10 destitation triangle is the
              winner.
            </p>
          </div>
          <svg
            width="336"
            height="371"
            viewBox="0 0 336 371"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M162.804 11C165.113 7 170.887 7 173.196 11L206.105 68C208.415 72 205.528 77 200.909 77H135.091C130.472 77 127.585 72 129.895 68L162.804 11Z"
              fill="#F55145"
              fillOpacity="0.5"
            />
            <path
              d="M173.196 356C170.887 360 165.113 360 162.804 356L129.895 299C127.585 295 130.472 290 135.091 290L200.909 290C205.528 290 208.415 295 206.105 299L173.196 356Z"
              fill="#2597F3"
              fillOpacity="0.5"
            />
            <path
              d="M35.3923 279.301C30.7735 279.301 27.8867 274.301 30.1961 270.301L63.1051 213.301C65.4145 209.301 71.188 209.301 73.4974 213.301L106.406 270.301C108.716 274.301 105.829 279.301 101.21 279.301L35.3923 279.301Z"
              fill="#C4C4C4"
              fillOpacity="0.5"
            />
            <path
              d="M234.392 279.301C229.774 279.301 226.887 274.301 229.196 270.301L262.105 213.301C264.415 209.301 270.188 209.301 272.497 213.301L305.406 270.301C307.716 274.301 304.829 279.301 300.21 279.301L234.392 279.301Z"
              fill="#C4C4C4"
              fillOpacity="0.5"
            />
            <path
              d="M275.12 159.595C272.839 163.611 267.065 163.652 264.728 159.669L231.416 102.903C229.078 98.9197 231.929 93.8994 236.548 93.8667L302.364 93.4003C306.983 93.3676 309.905 98.347 307.624 102.363L275.12 159.595Z"
              fill="#C4C4C4"
              fillOpacity="0.5"
            />
            <path
              d="M73.8396 159.595C71.5586 163.611 65.7852 163.652 63.4475 159.669L30.1355 102.903C27.7978 98.9197 30.6491 93.8994 35.2678 93.8667L101.084 93.4003C105.703 93.3676 108.625 98.347 106.344 102.363L73.8396 159.595Z"
              fill="#C4C4C4"
              fillOpacity="0.5"
            />
            <ellipse cx="168.5" cy="9" rx="8.5" ry="9" fill="#F55145" />
            <ellipse
              cx="168"
              cy="362"
              rx="9"
              ry="9"
              transform="rotate(-180 168 362)"
              fill="#2597F3"
            />
            <ellipse cx="168.5" cy="53" rx="8.5" ry="9" fill="#F55145" />
            <ellipse
              cx="168"
              cy="318"
              rx="9"
              ry="9"
              transform="rotate(-180 168 318)"
              fill="#2597F3"
            />
            <ellipse cx="168.5" cy="97" rx="8.5" ry="9" fill="#F55145" />
            <circle cx="80" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="279" cy="97" r="9" fill="#C4C4C4" />
            <ellipse cx="168.5" cy="141" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="168.5" cy="185.5" r="8.5" fill="#C4C4C4" />
            <ellipse cx="168.5" cy="230" rx="8.5" ry="9" fill="#C4C4C4" />
            <ellipse cx="168.5" cy="274" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="257" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="58" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="191" cy="53" r="9" fill="#F55145" />
            <ellipse
              cx="146"
              cy="318"
              rx="9"
              ry="9"
              transform="rotate(-180 146 318)"
              fill="#2597F3"
            />
            <circle cx="191" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="102" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="301" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="191" cy="141" r="9" fill="#C4C4C4" />
            <ellipse cx="191" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="191" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="191" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="279" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="80" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="213" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="213" cy="141" r="9" fill="#C4C4C4" />
            <ellipse cx="213" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="213" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="257" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="58" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="213" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="301" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="102" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="235" cy="141" r="9" fill="#C4C4C4" />
            <ellipse cx="235" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="235" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="279" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="80" cy="230" r="9" fill="#C4C4C4" />
            <ellipse cx="257" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="146" cy="53" r="9" fill="#F55145" />
            <ellipse
              cx="190"
              cy="318"
              rx="9"
              ry="9"
              transform="rotate(-180 190 318)"
              fill="#2597F3"
            />
            <circle cx="146" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="58" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="257" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="146" cy="141" r="9" fill="#C4C4C4" />
            <ellipse cx="146" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="146" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="146" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="235" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="36" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="124" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="36" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="235" cy="97" r="9" fill="#C4C4C4" />
            <circle cx="124" cy="141" r="9" fill="#C4C4C4" />
            <circle cx="80" cy="141" r="9" fill="#C4C4C4" />
            <circle cx="279" cy="141" r="9" fill="#C4C4C4" />
            <ellipse cx="124" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="124" cy="230" r="9" fill="#C4C4C4" />
            <circle cx="124" cy="274" r="9" fill="#C4C4C4" />
            <circle cx="102" cy="141" r="9" fill="#C4C4C4" />
            <circle cx="58" cy="141" r="9" fill="#C4C4C4" />
            <circle cx="257" cy="141" r="9" fill="#C4C4C4" />
            <ellipse cx="102" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="102" cy="230" r="9" fill="#C4C4C4" />
            <ellipse cx="80" cy="185.5" rx="9" ry="8.5" fill="#C4C4C4" />
            <circle cx="157" cy="31" r="9" fill="#F55145" />
            <ellipse
              cx="179"
              cy="340"
              rx="9"
              ry="9"
              transform="rotate(-180 179 340)"
              fill="#2597F3"
            />
            <circle cx="157" cy="75" r="9" fill="#F55145" />
            <ellipse
              cx="179"
              cy="296"
              rx="9"
              ry="9"
              transform="rotate(-180 179 296)"
              fill="#C4C4C4"
            />
            <circle cx="157" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="91" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="290" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="157" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="157" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="157" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="135" cy="75" r="9" fill="#F55145" />
            <ellipse
              cx="201"
              cy="296"
              rx="9"
              ry="9"
              transform="rotate(-180 201 296)"
              fill="#2597F3"
            />
            <circle cx="135" cy="119" r="9" fill="#C4C4C4" />
            <path
              d="M78 119C78 123.971 73.9706 128 69 128C64.0294 128 60 123.971 60 119C60 114.029 64.0294 110 69 110C73.9706 110 78 114.029 78 119Z"
              fill="#C4C4C4"
            />
            <ellipse cx="267.5" cy="119" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="135" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="135" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="135" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="113" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="47" cy="119" r="9" fill="#C4C4C4" />
            <ellipse cx="245.5" cy="119" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="113" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="113" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="113" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="91" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="69" cy="163" r="9" fill="#C4C4C4" />
            <ellipse cx="267.5" cy="163" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="91" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="179" cy="31" r="9" fill="#F55145" />
            <ellipse
              cx="157"
              cy="340"
              rx="9"
              ry="9"
              transform="rotate(-180 157 340)"
              fill="#2597F3"
            />
            <circle cx="179" cy="75" r="9" fill="#2597F3" />
            <ellipse
              cx="157"
              cy="296"
              rx="9"
              ry="9"
              transform="rotate(-180 157 296)"
              fill="#2597F3"
            />
            <circle cx="179" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="179" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="179" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="179" cy="252" r="9" fill="#C4C4C4" />
            <ellipse cx="245.5" cy="252" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="47" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="201" cy="75" r="9" fill="#F55145" />
            <ellipse
              cx="135"
              cy="296"
              rx="9"
              ry="9"
              transform="rotate(-180 135 296)"
              fill="#2597F3"
            />
            <circle cx="201" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="201" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="201" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="201" cy="252" r="9" fill="#C4C4C4" />
            <ellipse cx="267.5" cy="252" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="69" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="223" cy="119" r="9" fill="#C4C4C4" />
            <circle cx="223" cy="163" r="9" fill="#C4C4C4" />
            <circle cx="223" cy="208" r="9" fill="#C4C4C4" />
            <circle cx="223" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="290" cy="252" r="9" fill="#C4C4C4" />
            <circle cx="91" cy="252" r="9" fill="#C4C4C4" />
            <ellipse cx="245.5" cy="163" rx="8.5" ry="9" fill="#C4C4C4" />
            <ellipse cx="245.5" cy="208" rx="8.5" ry="9" fill="#C4C4C4" />
            <ellipse cx="267.5" cy="208" rx="8.5" ry="9" fill="#C4C4C4" />
            <circle cx="69" cy="208" r="9" fill="#C4C4C4" />
          </svg>
        </div>
      </Carousel>
    </Layout>
  )
}
export default Tutorial
