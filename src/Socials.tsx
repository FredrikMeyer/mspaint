import React from "react";
import { FaGithubSquare, FaTwitterSquare, FaLinkedin } from "react-icons/fa";
import "./App.scss";
import styles from "./Socials.module.scss";
import AppIcon from "./AppIcon";

export default function Socials() {
  return (
    <div className={styles.apps}>
      <AppIcon
        title="Github"
        link="https://github.com/FredrikMeyer/"
        Icon={FaGithubSquare}
      />
      <AppIcon
        title="Twitter"
        link="https://twitter.com/FredrikMeyer/"
        Icon={FaTwitterSquare}
      />
      <AppIcon
        title="LinkedIn"
        link="https://www.linkedin.com/in/fredrikmeyer/"
        Icon={FaLinkedin}
      />
    </div>
  );
}
