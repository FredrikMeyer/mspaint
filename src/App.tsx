import React from "react";
import type { Optional } from "./types";
import "./App.scss";
import Canvas from "./Canvas";
import Toolbar, { DrawingTool } from "./Toolbar";
import Menu from "./Menu";
import TopBar from "./TopBar";
import ColorPicker from "./ColorPicker";
import Socials from "./Socials";
import { MenuElementProp } from "./MenuElement";
import { COLORS, Color } from "./colors";

function useClearCanvasByKey(clearCanvas: () => void) {
  React.useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === "KeyN") {
        clearCanvas();
      }
    };
    window.addEventListener("keypress", listener);

    return () => window.removeEventListener("keypress", listener);
  }, [clearCanvas]);
}

function useCanvasDimension(
  canvasContainerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [canvasDimensions, setCanvasDimensions] =
    React.useState<Optional<[number, number]>>();

  React.useEffect(() => {
    const observer = new ResizeObserver((e) => {
      if (e.length > 0) {
        const observerEntry = e[0];
        setCanvasDimensions([
          observerEntry.contentRect.height,
          observerEntry.contentRect.width,
        ]);
      }
    });
    const current = canvasContainerRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => (current ? observer.unobserve(current) : undefined);
  });

  React.useEffect(() => {
    const current = canvasContainerRef.current;
    if (current) {
      const height = current.clientHeight;
      const width = current.clientWidth;

      setCanvasDimensions([height, width]);
    } else {
      // eslint-disable-next-line no-console
      console.log("No current!!");
    }
  }, [canvasContainerRef]);

  return canvasDimensions;
}

function App() {
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [currentColor, setCurrentColor] = React.useState<Color>(COLORS.BLACK);
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    React.useState<Color>(COLORS.WHITE);
  const [activeTool, setActiveTool] = React.useState<DrawingTool>("DRAW");
  const [toolSize, setToolSize] = React.useState<number>(1);

  const canvasDimensions = useCanvasDimension(canvasContainerRef);

  const clearCanvas = React.useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx && canvasDimensions) {
      const [height, width] = canvasDimensions;
      const scale = window.devicePixelRatio;
      ctx.clearRect(0, 0, width * scale, height * scale);
    } else {
      console.error("No ctx!");
    }
  }, [canvasRef, canvasDimensions]);

  useClearCanvasByKey(clearCanvas);

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
      shortcut: "b",
      callback: () => {
        window.location.href = "https://fredrikmeyer.net/";
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
                  {canvasDimensions && canvasContainerRef.current ? (
                    <Canvas
                      activeTool={activeTool}
                      container={canvasContainerRef.current}
                      backgroundCanvasRef={canvasRef}
                      currentColor={currentColor}
                      toolSize={toolSize}
                      height={canvasDimensions[0]}
                      width={canvasDimensions[1]}
                    />
                  ) : (
                    "No canvas loaded"
                  )}
                </div>
              </div>
              <ColorPicker
                currentColor={currentColor}
                setCurrentColor={setCurrentColor}
                currentBackgroundColor={currentBackgroundColor}
                setCurrentBackgroundColor={setCurrentBackgroundColor}
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
