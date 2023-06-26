import { useEffect, useState } from "react";

export enum Breakpoint {
  BASE = 0,
  XS = 320,
  MS = 480,
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

function matchesNow() {
  const xxlQuery = window.matchMedia(
    `screen and 
    (min-width: ${Breakpoint.XXL}px) and 
    (max-width: ${Breakpoint.XXL}px)`
  );
  const xlQuery = window.matchMedia(
    `screen and 
    (min-width: ${Breakpoint.XL}px) and 
    (max-width: ${Breakpoint.XXL - 1}px)`
  );
  const lgQuery = window.matchMedia(
    `screen and 
    (min-width: ${Breakpoint.LG}px) and 
    (max-width: ${Breakpoint.XXL - 1}px)`
  );
  const smQuery = window.matchMedia(
    `screen and 
    (min-width: ${Breakpoint.SM}px) and 
    (max-width: ${Breakpoint.MD - 1}px)`
  );
  const msQuery = window.matchMedia(
    `screen and 
    (min-width: ${Breakpoint.MS}px) and
     (max-width: ${Breakpoint.SM - 1}px)`
  );
  const mdQuery = window.matchMedia(
    `screen and
     (min-width: ${Breakpoint.MD}px) and 
    (max-width: ${Breakpoint.LG - 1}px)`
  );
  const xsQuery = window.matchMedia(
    `screen and
    (min-width: ${Breakpoint.XS}px) and 
    (max-width: ${Breakpoint.MS - 1}px)`
  );

  if (xxlQuery.matches) return Breakpoint.XXL;
  if (xlQuery.matches) return Breakpoint.XL;
  if (lgQuery.matches) return Breakpoint.LG;
  if (mdQuery.matches) return Breakpoint.MD;
  if (smQuery.matches) return Breakpoint.SM;
  if (msQuery.matches) return Breakpoint.MS;
  if (xsQuery.matches) return Breakpoint.XS;
  return Breakpoint.BASE;
}

export default function useMediaQuery() {
  const [breakPoint, setBreakPoint] = useState<Breakpoint>(matchesNow());

  useEffect(() => {
    const xxlQuery = window.matchMedia(
      `screen and 
      (min-width: ${Breakpoint.XXL}px) and 
      (max-width: ${Breakpoint.XXL}px)`
    );
    const xlQuery = window.matchMedia(
      `screen and 
      (min-width: ${Breakpoint.XL}px) and 
      (max-width: ${Breakpoint.XXL - 1}px)`
    );
    const lgQuery = window.matchMedia(
      `screen and 
      (min-width: ${Breakpoint.LG}px) and 
      (max-width: ${Breakpoint.XXL - 1}px)`
    );
    const smQuery = window.matchMedia(
      `screen and 
      (min-width: ${Breakpoint.SM}px) and 
      (max-width: ${Breakpoint.MD - 1}px)`
    );
    const msQuery = window.matchMedia(
      `screen and 
      (min-width: ${Breakpoint.MS}px) and
       (max-width: ${Breakpoint.SM - 1}px)`
    );
    const mdQuery = window.matchMedia(
      `screen and
       (min-width: ${Breakpoint.MD}px) and 
      (max-width: ${Breakpoint.LG - 1}px)`
    );
    const xsQuery = window.matchMedia(
      `screen and
      (min-width: ${Breakpoint.XS}px) and 
      (max-width: ${Breakpoint.MS - 1}px)`
    );
    const baseQuery = window.matchMedia(
      `screen and
       (min-width: ${Breakpoint.BASE}px) and
       (max-width: ${Breakpoint.XS - 1}px)`
    );

    baseQuery.addEventListener("change", () => {
      if (baseQuery.matches) setBreakPoint(Breakpoint.BASE);
    });
    xsQuery.addEventListener("change", () => {
      if (xsQuery.matches) setBreakPoint(Breakpoint.XS);
    });
    msQuery.addEventListener("change", () => {
      if (msQuery.matches) setBreakPoint(Breakpoint.MS);
    });
    smQuery.addEventListener("change", () => {
      if (smQuery.matches) setBreakPoint(Breakpoint.SM);
    });
    mdQuery.addEventListener("change", () => {
      if (mdQuery.matches) setBreakPoint(Breakpoint.MD);
    });
    lgQuery.addEventListener("change", () => {
      if (lgQuery.matches) setBreakPoint(Breakpoint.LG);
    });
    xlQuery.addEventListener("change", () => {
      if (xlQuery.matches) setBreakPoint(Breakpoint.XL);
    });
    xxlQuery.addEventListener("change", () => {
      if (xxlQuery.matches) setBreakPoint(Breakpoint.XXL);
    });
  }, []);

  return [breakPoint];
}
