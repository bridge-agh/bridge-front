import GameScene from "@/game_engine/gameScene";
import { useEffect, useRef, useState } from "react";

export default function PlayingPage() {
  const parentRef = useRef(null!);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      });
    });
    ro.observe(parentRef.current);
    return () => ro.disconnect();
  }, []);


  return (
    <div ref={parentRef} className="absolute content-height w-full top-0 left-0">
      <GameScene width={width} height={height} parentRef={parentRef} />
    </div >
  );
}
