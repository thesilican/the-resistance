import React, { Fragment, useEffect, useRef, useState } from "react";
import { Layer, Image, Stage, Sprite, Rect } from "react-konva";
import useImage from "use-image";
import styles from "../../../styles/game/GameCanvas.module.scss";

const tmpurl = `${process.env.PUBLIC_URL}/assets/stickman.png`;

const getDim = () => {
  return [window.innerWidth, window.innerHeight];
};

export default function GameCanvas() {
  const divRef = useRef(null as HTMLDivElement | null);
  const [dim, setDim] = useState(getDim);
  useEffect(() => {
    const handler = () => {
      setDim(getDim());
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <Stage width={dim[0]} height={dim[1]} className={styles.canvasWrapper}>
      <Layer>{/* <PlayerSprite x={dim[0] / 2} y={dim[1] / 2} /> */}</Layer>
    </Stage>
  );
}

type PlayerSpriteProps = {
  x: number;
  y: number;
};

function PlayerSprite(props: PlayerSpriteProps) {
  const [image, state] = useImage(tmpurl);
  const [hover, setHover] = useState(false);
  if (state === "loading" || state === "failed") {
    return <Fragment />;
  }
  const width = hover ? 300 : 200;
  const height = hover ? 450 : 300;

  return (
    <Fragment>
      <Image
        image={image!}
        x={props.x - width / 2}
        y={props.y - width / 2}
        width={width}
        height={height}
      />
      <Rect
        x={props.x - width / 2}
        y={props.y - width / 2}
        width={width}
        height={height}
        stroke="white"
        onMouseOut={() => setHover(false)}
        onMouseOver={() => setHover(true)}
      />
    </Fragment>
  );
}
