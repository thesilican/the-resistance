import React, { useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { useStore } from "../../../store";
import Util from "../../../util";
import PlayerSprite from "./PlayerSprite";

type Layout = {
  canvas: {
    w: number;
    h: number;
  };
  screen: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  ellipse: {
    x: number;
    y: number;
    rX: number;
    rY: number;
  };
  spritePos: {
    x: number;
    y: number;
    faceLeft: boolean;
  }[];
};
const emptyLayout: Layout = {
  canvas: {
    w: 0,
    h: 0,
  },
  screen: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  },
  ellipse: {
    x: 0,
    y: 0,
    rX: 0,
    rY: 0,
  },
  spritePos: [],
};

const calculateSize = (size: number[], numSprites: number): Layout => {
  const SPRITE_W = 60;
  const SPRITE_H = 90;
  const canvasW = size[0];
  const canvasH = size[1];
  const screenX = canvasW * (1 / 4);
  const screenY = canvasH * (2 / 10);
  const screenW = canvasW * (2 / 4);
  const screenH = canvasH * (5 / 10);
  const ellipseX = screenX + screenW / 2;
  const ellipseY = screenY + screenH / 2;
  const ellipseRadiusX = (screenW - SPRITE_W) / 2;
  const ellipseRadiusY = (screenH - SPRITE_H) / 2;

  // Generate equi-distant points around an ellipse
  const spritePos = Util.genEllipseEqualSpaced(
    ellipseX,
    ellipseY,
    ellipseRadiusX,
    ellipseRadiusY,
    numSprites
  ).map((p) => ({
    x: p[0],
    y: p[1],
    faceLeft: p[0] > ellipseX,
  }));

  return {
    canvas: {
      w: canvasW,
      h: canvasH,
    },
    screen: {
      x: screenX,
      y: screenY,
      w: screenW,
      h: screenH,
    },
    ellipse: {
      x: ellipseX,
      y: ellipseY,
      rX: ellipseRadiusX,
      rY: ellipseRadiusY,
    },
    spritePos,
  };
};

export default function GameCanvas() {
  const ref: React.MutableRefObject<HTMLDivElement> = useRef(
    {} as HTMLDivElement
  );
  const [state] = useStore();
  const [layout, setLayout] = useState(emptyLayout);

  const updateLayout = () => {
    const size = [ref.current.clientWidth, ref.current.clientHeight];
    setLayout(calculateSize(size, state.game!.players.length));
  };
  // Update layout on initial render
  useEffect(updateLayout, []);
  useEffect(() => {
    // Update layout on window resize
    window.onresize = updateLayout;
  }, []);

  return (
    <div className="GameCanvas" ref={ref}>
      <Stage width={layout.canvas.w} height={layout.canvas.h}>
        <Layer>
          {/* <CanvasBackground w={size[0]} h={size[1]} /> */}
          {/* <Rect
            x={layout.screen.x}
            y={layout.screen.y}
            width={layout.screen.w}
            height={layout.screen.h}
            stroke="red"
          ></Rect>
          <Ellipse
            x={layout.ellipse.x}
            y={layout.ellipse.y}
            radiusX={layout.ellipse.rX}
            radiusY={layout.ellipse.rY}
            stroke="orange"
          ></Ellipse> */}
        </Layer>
        <Layer>
          {layout.spritePos.map((p, i) => (
            <PlayerSprite
              x={p.x}
              y={p.y}
              faceLeft={p.faceLeft}
              key={i}
              index={i}
              state={state}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

type CanvasBackgroundProps = {
  w: number;
  h: number;
};

function CanvasBackground({ w, h }: CanvasBackgroundProps) {
  const [background] = useImage(
    "http://www.grasscloth-wallpaper.com/wp-content/uploads/2014/10/black-black-grass-free-icons-free-download.jpg"
  );
  return <Image image={background} x={0} y={0} width={w} height={h}></Image>;
}
