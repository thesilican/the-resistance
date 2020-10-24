import { Sprite, Stage } from "@inlet/react-pixi";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/game/GameCanvas.module.scss";

const tmpurl = `${process.env.PUBLIC_URL}/assets/periodic-table-sticker.png`;

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
          backgroundColor: 0x343a40,
          resolution: devicePixelRatio,
        }}
      >
        <Sprite
          image={tmpurl}
          interactive
          pointerover={() => setClicked(true)}
          pointerout={() => setClicked(false)}
          x={dim[0] / 2}
          y={dim[1] / 2}
          width={clicked ? 100 : 200}
          height={clicked ? 100 : 200}
        />
      </Stage>
    </div>
  );
}
