import React from "react";
import "./App.scss";
import menuIcons from "./toolbar.png";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import Canvas from "./Canvas";

function numberToXY(n: number): [number, number] {
  const x = n % 2;
  const y = (n - (n % 2)) / 2;

  return [x, y];
}

type ToolbarIconProperties = {
  sourceImage: HTMLImageElement;
  n: number;
  marked: boolean;
  setAsActive: () => void;
};

function ToolbarIcon(properties: ToolbarIconProperties) {
  const { sourceImage, n, marked, setAsActive } = properties;

  const reference = React.useRef<HTMLCanvasElement>(null);

  const [x, y] = numberToXY(n);

  const sw = 82;
  const sh = 90;

  const w = 41;
  const h = 45;

  React.useEffect(() => {
    const canvas = reference.current;

    const context = canvas?.getContext("2d");
    if (!context) return;

    context.filter = `invert(${marked ? 1 : 0})`;

    context.drawImage(
      sourceImage,
      3 + x * (sw + 7),
      4 + y * (sh + 7.5),
      sw,
      sh,
      0,
      0,
      w,
      h
    );
  }, [marked, sourceImage, x, y]);

  return (
    <div
      style={{ border: "1px solid black", height: `${h}px`, width: `${w}px` }}
    >
      <canvas
        style={{
          margin: "0px",
          height: `${h}px`,
          width: `${w}px`,
        }}
        ref={reference}
        width={w}
        height={h}
        onClick={setAsActive}
      ></canvas>
    </div>
  );
}

function Menu() {
  return (
    <div className="menu">
      <div className="menu-elements">
        <div>File</div>
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

function Toolbar() {
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

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-text">Fredrik Meyer - [Untitled]</div>
      <div className="topbar-icons">
        <div className="icon">
          <MdArrowDropDown />
        </div>
        <div className="icon">
          <MdArrowDropUp />
        </div>
      </div>
    </div>
  );
}

function ColorPicker({
  setCurrentColor,
}: {
  setCurrentColor: (c: string) => void;
}) {
  const colors = [
    "white",
    "grey",
    "red",
    "yellow",
    "cyan",
    "blue",
    "magenta",
    "lightyellow",
    "lightgreen",
    "lightskyblue",
    "orchid",
  ];

  const row2 = [
    "black",
    "darkgrey",
    "darkred",
    "goldenrod",
    "seagreen",
    "cornflowerblue",
    "darkblue",
    "mediumpurple",
    "wheat",
    "darkolivegreen",
    "dodgerblue",
  ];
  return (
    <div className="main-cc-color-picker">
      <div className="main-cc-color-picker-row">
        {colors.map((c, i) => (
          <div
            key={i}
            style={{ backgroundColor: c }}
            onClick={() => setCurrentColor(c)}
          ></div>
        ))}
      </div>
      <div className="main-cc-color-picker-row">
        {row2.map((c, i) => (
          <div
            key={i}
            style={{ backgroundColor: c }}
            onClick={() => setCurrentColor(c)}
          ></div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  const [currentColor, setCurrentColor] = React.useState<string>("black");

  const [canvasHeight, setCanvasHeight] = React.useState<undefined | number>(
    undefined
  );
  const [canvasWidth, setCanvasWidth] = React.useState<undefined | number>(
    undefined
  );

  React.useEffect(() => {
    const current = canvasContainerRef.current;
    if (current) {
      const height = current.clientHeight;
      const width = current.clientWidth;

      setCanvasHeight(height);
      setCanvasWidth(width);

      console.log(height, width);
    } else {
      console.log("No current!!");
    }
  }, []);

  return (
    <div className="app">
      <div className="window">
        <div>
          <TopBar />
          <Menu />
        </div>
        <div className="main">
          <Toolbar />
          <div className="main-cc">
            <div
              className="main-cc-canvas"
              id="canvas"
              ref={canvasContainerRef}
            >
              {canvasHeight && canvasWidth && (
                <Canvas
                  containerRef={canvasContainerRef}
                  currentColor={currentColor}
                  height={canvasHeight}
                  width={canvasWidth}
                />
              )}
            </div>
            <ColorPicker setCurrentColor={setCurrentColor} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
