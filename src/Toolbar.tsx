import React from "react";
import menuIcons from "./toolbar.png";

import ToolbarIcon from "./ToolbarIcon";

export default function Toolbar() {
  const [activeState, setActiveState] = React.useState(7);

  const icons = React.useMemo(() => {
    const icons = new Image(178, 856);
    icons.src = menuIcons;

    return icons;
  }, []);

  React.useEffect(() => {
    icons.src = menuIcons;
  }, [icons]);
  const [menuLoaded, setMenuLoaded] = React.useState(false);

  React.useEffect(() => {
    icons.onload = () => setMenuLoaded(true);
  }, [icons]);
  return (
    <div className="main-toolbar">
      {menuLoaded &&
        [...Array(18).keys()].map((i) => (
          <ToolbarIcon
            key={i}
            sourceImage={icons}
            n={i}
            marked={i == activeState}
            setAsActive={() => setActiveState(i)}
          />
        ))}
    </div>
  );
}
