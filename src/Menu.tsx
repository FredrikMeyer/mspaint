import React from "react";
import styles from "./Menu.module.scss";
import MenuElement, { MenuElementProp } from "./MenuElement";

type MenuProps = {
  elements: MenuElementProp[];
};

export default function Menu({ elements }: MenuProps) {
  return (
    <div className={styles.menu}>
      <div className={styles["menu-elements"]}>
        {elements.map((el) => (
          <MenuElement prop={el} key={el.title} />
        ))}
      </div>
    </div>
  );
}
