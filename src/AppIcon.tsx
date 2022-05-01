import React from "react";
import { IconType } from "react-icons/lib";
import { useClickedOutside } from "./utils";
import styles from "./AppIcon.module.scss";

export default function AppIcon({
  Icon,
  title,
  link,
}: {
  Icon: IconType;
  title: string;
  link: string;
}) {
  const [clicked, setClicked] = React.useState(false);

  const { ref } = useClickedOutside<HTMLButtonElement>((v) => setClicked(!v));

  const clickedClass = clicked ? styles["app-icon-clicked"] : "";
  const clickedTextClass = clicked ? styles["app-icon-text-clicked"] : "";

  return (
    <button
      ref={ref}
      className={`${styles["app-icon"]} ${clickedClass}`}
      onClick={() => {
        setClicked(true);

        if (clicked) {
          window.location.href = link;
        }
      }}
    >
      <Icon size={40} title={title} />

      <div className={`${styles["app-icon-text"]} ${clickedTextClass}`}>
        {title}
      </div>
    </button>
  );
}
