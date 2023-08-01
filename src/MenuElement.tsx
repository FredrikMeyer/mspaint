import React from "react";
import styles from "./MenuElement.module.scss";
import { NonEmptyArray, Optional } from "./types";

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

function useShortcutListener(
  active: boolean,
  shortcut: Optional<string>,
  callback: Optional<() => void>,
) {
  React.useEffect(() => {
    const eventListener = (ev: KeyboardEvent) => {
      const upper = shortcut?.toUpperCase();
      if (ev.code === `Key${upper}`) {
        if (callback) {
          callback();
        }
      }
    };
    if (shortcut && active) {
      document.addEventListener("keydown", eventListener);
    }
    return () => {
      if (shortcut) document.removeEventListener("keydown", eventListener);
    };
  }, [active, callback, shortcut]);
}

export type MenuElementProp =
  | {
      kind: "LEAF";
      title: string;
      shortcut?: string;
      callback: () => void;
    }
  | {
      kind: "NODE";
      title: string;
      shortcut?: string;
      elements: NonEmptyArray<MenuElementProp>;
    };

export default function MenuElement({
  prop,
  marked,
  listenForKey,
}: {
  prop: MenuElementProp;
  marked: boolean;
  listenForKey: boolean;
}) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useDropdownVisible(false);

  const callback =
    prop.kind == "NODE" ? () => setIsComponentVisible(true) : prop.callback;

  useShortcutListener(
    listenForKey,
    prop.shortcut,
    (prop.kind == "LEAF" && prop.callback) || undefined,
  );
  return (
    <div
      className={`${styles["menu-element"]} ${
        marked ? styles["menu-element-marked"] : ""
      }`}
      ref={ref}
    >
      <div onClick={callback}>{prop.title}</div>
      {prop.kind == "NODE" ? (
        <Dropdown show={isComponentVisible}>
          {prop.elements.map((el) => {
            if (el.kind == "LEAF") {
              return (
                <div
                  key={el.title}
                  onClick={() => {
                    el.callback();
                    setIsComponentVisible(false);
                  }}
                >
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
