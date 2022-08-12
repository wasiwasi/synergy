import React, { useEffect, useState } from "react";
import "./Home.css";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import arrow from "../images/upArrow.png";

function ScrollToTopButton() {
  const height = 200;
  const [showButton, setShowButton] = React.useState(false);
  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const handleScroll = (event: any) => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > height) {
      setShowButton(true);
    } else if (scrolled <= height) {
      setShowButton(false);
    }
  };
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Button
      className={showButton ? "scroll-to-top-btn" : "hidden"}
      // style={{ display: showButton ? "inline" : "none" }}
      onClick={scrollToTop}
    >
      <h4>위로가기</h4>

      <svg width="32" height="32" viewBox="0 0 100 100">
        {/* <img src={arrow} /> */}
        {/* <img></img> */}
        <path
          fill="#c2c2c2"
          d="m50 0c-13.262 0-25.98 5.2695-35.355 14.645s-14.645 22.094-14.645 35.355 5.2695 25.98 14.645 35.355 22.094 14.645 35.355 14.645 25.98-5.2695 35.355-14.645 14.645-22.094 14.645-35.355-5.2695-25.98-14.645-35.355-22.094-14.645-35.355-14.645zm20.832 62.5-20.832-22.457-20.625 22.457c-1.207 0.74219-2.7656 0.57812-3.7891-0.39844-1.0273-0.98047-1.2695-2.5273-0.58594-3.7695l22.918-25c0.60156-0.61328 1.4297-0.96094 2.2891-0.96094 0.86328 0 1.6914 0.34766 2.293 0.96094l22.918 25c0.88672 1.2891 0.6875 3.0352-0.47266 4.0898-1.1562 1.0508-2.9141 1.0859-4.1133 0.078125z"
        ></path>
      </svg>
    </Button>
  );
}
export const Button = styled.div`
  bottom: 5%;
  border: 0px;
  cursor: pointer;
  padding: 0px;
  position: fixed;
  right: 5%;
`;

export default ScrollToTopButton;
