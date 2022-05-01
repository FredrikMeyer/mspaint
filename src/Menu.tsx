import React from "react";
import styles from "./Menu.module.scss";

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

function Dropdown({ show }: { show: boolean }) {
  const showClass = show ? styles["dropdown-show"] : "";
  const classes = `${styles.dropdown} ${showClass}`;
  return (
    <div className={classes}>
      <div>New</div>
      <div>Other</div>
    </div>
  );
}

function MenuElement() {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useDropdownVisible(false);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div onClick={() => setIsComponentVisible(true)}>File</div>
      <Dropdown show={isComponentVisible} />
    </div>
  );
}

export default function Menu() {
  return (
    <div className={styles.menu}>
      <div className={styles["menu-elements"]}>
        <MenuElement />
        <div>About</div>
        <div>
          <a href="https://blog.fredrikmeyer.net/">Blog</a>
        </div>
        <div>Recommendations</div>
        <div>Contact</div>
        <div>Etc</div>
      </div>
    </div>
  );
}