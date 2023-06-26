import { useEffect, useState } from "react";

// make return variables optional and to be sleected by the user
export default function useElement<T extends HTMLElement>(
  initialElement: T | null
): [number, number, (newElement: T | null) => void] {
  const [element, setElement] = useState<T | null>(initialElement);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const observeElement = new ResizeObserver(() => {
      if (element) {
        setWidth(element.offsetWidth);
        setHeight(element.offsetHeight);
      }
    });

    if (element) {
      observeElement.observe(element);
    }
  }, [element]);

  return [width, height, setElement];
}
