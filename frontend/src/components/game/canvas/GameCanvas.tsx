import * as PIXI from "pixi.js";
import { Sprite, Stage, Text } from "@inlet/react-pixi";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/game/GameCanvas.module.scss";

const tmpurl = `${process.env.PUBLIC_URL}/assets/stickman.png`;

function getDimensions() {
  return [
    window.innerWidth / window.devicePixelRatio,
    window.innerHeight / window.devicePixelRatio,
  ];
}

export default function GameCanvas() {
  const containerRef = useRef(null as HTMLDivElement | null);
  const [dim, setDim] = useState(getDimensions);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handler = () => {
      setDim(getDimensions());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div ref={containerRef} className={styles.canvasWrapper}>
      <Stage
        width={dim[0]}
        height={dim[1]}
        options={{
          antialias: true,
          backgroundColor: 0x343a40,
        }}
      >
        <PlayerSprite x={dim[0] / 2} y={dim[1] / 2} />
        <Text anchor={0.5} x={dim[0] / 2} y={dim[1] / 2 + 200} text={"Hello"} />
      </Stage>
    </div>
  );
}

type PlayerSpriteProps = {
  x: number;
  y: number;
};

function PlayerSprite(props: PlayerSpriteProps) {
  const [texture] = useState(() =>
    PIXI.Texture.from(tmpurl, {
      scaleMode: PIXI.SCALE_MODES.NEAREST,
    })
  );
  console.log(texture.width);
  return (
    <Sprite
      texture={texture}
      scale={2}
      anchor={0.5}
      // image={texture}
      interactive
      x={props.x}
      y={props.y}
      width={300}
      height={400}
    />
  );
}
