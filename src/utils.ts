import React from "react";

export function useClickedOutside<E extends HTMLElement>(
  setClickedOutside: (cl: boolean) => void
) {
  const ref = React.useRef<E>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setClickedOutside(true);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setClickedOutside]);
  return { ref };
}
