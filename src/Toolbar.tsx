import React from "react";
import menuIcons from "./toolbar.png";
import ToolbarIcon from "./ToolbarIcon";
import styles from "./Toolbar.module.scss";
import { DrawingTool } from "./types";

const toolMap: Record<DrawingTool, number> = {
  DRAW: 7,
  ERASE: 5,
  NOOP: -1,
};

const rToolMap: Record<number, DrawingTool> = { 7: "DRAW", 5: "ERASE" };

export default function Toolbar({
  activeTool,
  setActiveTool,
}: {
  activeTool: DrawingTool;
  setActiveTool: (t: DrawingTool) => void;
}) {
  const activeToolIndex = React.useMemo(() => {
    return toolMap[activeTool];
  }, [activeTool]);

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
    <div className={styles.toolbar}>
      {menuLoaded &&
        [...Array(18).keys()].map((i) => (
          <ToolbarIcon
            key={i}
            sourceImage={icons}
            n={i}
            marked={i == activeToolIndex}
            setAsActive={() => setActiveTool(rToolMap[i] ?? i)}
          />
        ))}
    </div>
  );
}
