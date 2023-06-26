function AceClubs({
  className,
  background,
  fill,
}: {
  className?: string;
  background: string;
  fill: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      preserveAspectRatio="none"
      viewBox="-106 -164.5 212 329"
    >
      <defs>
        <symbol
          id="VCA"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-270 460L-110 460M-200 450L0 -460L200 450M110 460L270 460M-120 130L120 130"
            stroke="#e3e3e3"
            stroke-width="80"
            stroke-linecap="square"
            stroke-miterlimit="1.5"
            fill="none"
          ></path>
        </symbol>
        <symbol
          id="SCA"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M30 150C35 385 85 400 130 500L-130 500C-85 400 -35 385 -30 150A10 10 0 0 0 -50 150A210 210 0 1 1 -124 -51A10 10 0 0 0 -110 -65A230 230 0 1 1 110 -65A10 10 0 0 0 124 -51A210 210 0 1 1 50 150A10 10 0 0 0 30 150Z"
            fill={fill}
          ></path>
        </symbol>
      </defs>
      <rect
        width="211"
        height="328"
        x="-105.5"
        y="-164"
        rx="19"
        ry="19"
        fill={background}
      ></rect>
      <use xlinkHref="#SCA" height="54" width="54" x="-27" y="-27"></use>
      <use xlinkHref="#VCA" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SCA"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VCA"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SCA"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
      </g>
    </svg>
  );
}

export default AceClubs;
