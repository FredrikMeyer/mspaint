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

interface Toolbase {
  tool: string;
}

interface Pen extends Toolbase {
  tool: "pen";
  color: string;
  width: number;
}

interface Text {
  tool: "text";
  color: string;
}

type Tool = Pen | Text;

function App() {
  const [showContact, setShowContact] = React.useState(false);
  const [activeTool, setActiveTool] = React.useState<Tool>({
    color: "black",
    width: 2,
    tool: "pen",
  });
  const [activeState, setActiveState] = React.useState(1);

  const icons = new Image(178, 856);
  icons.src = menuIcons;

  React.useEffect(() => {
    icons.src = menuIcons;
  }, []);

  const [menuLoaded, setMenuLoaded] = React.useState(false);

  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.log("hei");
    icons.onload = () => setMenuLoaded(true);
  }, []);

  return (
    <div className="app">
      <div className="window">
        <div className="top-line">
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
          <div className="menu">
            <div className="menu-elements">
              <div>File</div>
              <div>About</div>
              <div>
                <a href="https://blog.fredrikmeyer.net/">Blog</a>
              </div>
              <div>Recommendations</div>
              <div onClick={() => setShowContact(true)}>Contact</div>
              <div>Etc</div>
            </div>
          </div>
        </div>
        <div className="main">
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
          <div className="main-cc">
            <div
              className="main-cc-canvas"
              id="canvas"
              ref={canvasContainerRef}
            >
              <Canvas containerRef={canvasContainerRef} />
            </div>
            <div className="main-cc-color-picker"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
