import React from "react";
import styles from "./Menu.module.scss";
import MenuElement, { MenuElementProp } from "./MenuElement";

type MenuProps = {
  elements: MenuElementProp[];
};

function useActivateMenu(numberOfElements: number) {
  const [active, setActive] = React.useState(false);
  const [activeElement, setActiveElement] = React.useState(0);

  React.useEffect(() => {
    const eventListener = (ev: KeyboardEvent) => {
      if (ev.key === "Alt") {
        setActive(!active);
      }

      if (ev.key === "ArrowRight") {
        setActiveElement((activeElement + 1) % numberOfElements);
      }
      if (ev.key === "ArrowLeft") {
        setActiveElement(
          (activeElement + numberOfElements - 1) % numberOfElements
        );
      }
    };
    document.addEventListener("keydown", eventListener);

    return () => {
      document.removeEventListener("keydown", eventListener);
    };
  }, [active, numberOfElements, activeElement]);

  return { active, activeElement };
}

export default function Menu({ elements }: MenuProps) {
  const { active, activeElement } = useActivateMenu(elements.length);

  return (
    <div className={styles.menu}>
      <div className={styles["menu-elements"]}>
        {elements.map((el, idx) => (
          <MenuElement
            prop={el}
            key={el.title}
            marked={active && idx == activeElement}
            listenForKey={active}
          />
        ))}
      </div>
    </div>
  );
}
