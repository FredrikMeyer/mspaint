import React from "react";
import { FaGithubSquare, FaTwitterSquare, FaLinkedin } from "react-icons/fa";
import "./App.scss";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import Menu from "./Menu";
import TopBar from "./TopBar";
import ColorPicker from "./ColorPicker";
import AppIcon from "./AppIcon";

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
    } else {
      // eslint-disable-next-line no-console
      console.log("No current!!");
    }
  }, []);

  return (
    <>
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
      <div className="apps">
        <AppIcon
          title="Github"
          link="https://github.com/FredrikMeyer/"
          Icon={FaGithubSquare}
        />
        <AppIcon
          title="Twitter"
          link="https://twitter.com/FredrikMeyer/"
          Icon={FaTwitterSquare}
        />
        <AppIcon
          title="LinkedIn"
          link="https://www.linkedin.com/in/fredrikmeyer/"
          Icon={FaLinkedin}
        />
      </div>
    </>
  );
}

export default App;
