import React from "react";
import type { DrawingTool, Optional } from "./types";
import "./App.scss";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import Menu from "./Menu";
import TopBar from "./TopBar";
import ColorPicker from "./ColorPicker";
import Socials from "./Socials";
import { MenuElementProp } from "./MenuElement";

function App() {
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [currentColor, setCurrentColor] = React.useState<string>("black");
  const [activeTool, setActiveTool] = React.useState<DrawingTool>("DRAW");
  const [toolSize, setToolSize] = React.useState<number>(1);

  const [canvasHeight, setCanvasHeight] =
    React.useState<Optional<number>>(undefined);
  const [canvasWidth, setCanvasWidth] =
    React.useState<Optional<number>>(undefined);

  React.useEffect(() => {
    const current = canvasContainerRef.current;
    if (current) {
      const height = current.clientHeight;
      const width = current.clientWidth;

      setCanvasHeight(height);
      setCanvasWidth(width);
    } else {
      // eslint-disable-next-line no-console
      console.log("No current!!");
    }
  }, []);

  const clearCanvas = React.useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx && canvasWidth && canvasHeight) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    } else {
      // eslint-disable-next-line no-console
      console.error("No ctx!");
    }
  }, [canvasRef, canvasHeight, canvasWidth]);

  const menuElements: MenuElementProp[] = [
    {
      kind: "NODE",
      title: "File",
      elements: [
        {
          kind: "LEAF",
          title: "New",
          callback: clearCanvas,
        },
        {
          kind: "LEAF",
          title: "Save",
          callback: () => {
            const current = canvasRef.current;
            if (current) {
              const link = document.createElement("a");
              link.download = "canvas.png";
              link.href = current.toDataURL("image/png");
              link.click();
            }
            // eslint-disable-next-line no-console
            console.log("Save");
          },
        },
      ],
    },
    {
      kind: "LEAF",
      title: "About",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log("About");
      },
    },
    {
      kind: "LEAF",
      title: "Blog",
      callback: () => {
        window.location.href = "https://blog.fredrikmeyer.net/";
      },
    },
    {
      kind: "LEAF",
      title: "Recommendations",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log("Recommendations");
      },
    },
    {
      kind: "LEAF",
      title: "Contact",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log("Contact");
      },
    },
  ];

  return (
    <div className="container">
      <div className="app">
        <div className="window">
          <TopBar />
          <Menu elements={menuElements} />
          <div className="main">
            <Toolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              toolSize={toolSize}
              setToolSize={setToolSize}
            />
            <div className="main-cc">
              <div className="main-cc-canvas-container">
                <div
                  className="main-cc-canvas"
                  id="canvas"
                  ref={canvasContainerRef}
                >
                  {canvasHeight && canvasWidth ? (
                    <Canvas
                      activeTool={activeTool}
                      containerRef={canvasContainerRef}
                      canvasRef={canvasRef}
                      currentColor={currentColor}
                      toolSize={toolSize}
                      height={canvasHeight}
                      width={canvasWidth}
                    />
                  ) : (
                    "No canvas loaded"
                  )}
                </div>
              </div>
              <ColorPicker
                currentColor={currentColor}
                setCurrentColor={setCurrentColor}
              />
            </div>
          </div>
        </div>
      </div>
      <Socials />
    </div>
  );
}

export default App;
