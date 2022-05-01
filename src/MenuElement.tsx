import React from "react";
import styles from "./MenuElement.module.scss";

/**
 * Found here https://stackoverflow.com/a/45323523/1013553
 */
function useDropdownVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] =
    React.useState(initialIsVisible);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

function Dropdown({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  if (!children) return null;
  const showClass = show ? styles["dropdown-show"] : "";
  const classes = `${styles.dropdown} ${showClass}`;
  return <div className={classes}>{children}</div>;
}

type NonEmptyArray<T> = [T, ...T[]];

export type MenuElementProp =
  | {
      kind: "LEAF";
      title: string;
      callback: () => void;
    }
  | {
      kind: "NODE";
      title: string;
      elements: NonEmptyArray<MenuElementProp>;
    };

export default function MenuElement({ prop }: { prop: MenuElementProp }) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useDropdownVisible(false);

  return (
    <div className={styles["menu-element"]} ref={ref}>
      <div onClick={() => setIsComponentVisible(true)}>{prop.title}</div>
      {prop.kind == "NODE" ? (
        <Dropdown show={isComponentVisible}>
          {prop.elements.map((el) => {
            if (el.kind == "LEAF") {
              return (
                <div key={el.title} onClick={el.callback}>
                  {el.title}
                </div>
              );
            } else {
              return null;
            }
          })}
        </Dropdown>
      ) : null}
    </div>
  );
}
