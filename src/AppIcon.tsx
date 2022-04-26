import React from "react";
import { IconType } from "react-icons/lib";
import { useClickedOutside } from "./utils";

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

  const clickedClass = clicked ? "app-icon-clicked" : "";
  const clickedTextClass = clicked ? "app-icon-text-clicked" : "";

  return (
    <button
      ref={ref}
      className={`app-icon ${clickedClass}`}
      onClick={() => {
        setClicked(true);

        if (clicked) {
          window.location.href = link;
        }
      }}
    >
      <Icon size={40} title={title} />

      <div className={`app-icon-text ${clickedTextClass}`}>{title}</div>
    </button>
  );
}
