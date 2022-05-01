import React from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import styles from "./TopBar.module.scss";

export default function TopBar() {
  return (
    <div className={styles.topbar}>
      <div className={styles["topbar-text"]}>Fredrik Meyer - [Untitled]</div>
      <div className={styles["topbar-icons"]}>
        <div className={styles.icon}>
          <MdArrowDropDown />
        </div>
        <div className={styles.icon}>
          <MdArrowDropUp />
        </div>
      </div>
    </div>
  );
}
