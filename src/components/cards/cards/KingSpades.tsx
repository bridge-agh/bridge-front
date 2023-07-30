function KingSpades({
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
          id="SSK"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z"
            fill={fill}
          ></path>
        </symbol>
        <symbol
          id="VSK"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-285 -460L-85 -460M-185 -460L-185 460M-285 460L-85 460M85 -460L285 -460M185 -440L-170 155M85 460L285 460M185 440L-10 -70"
            stroke={fill}
            strokeWidth="80"
            strokeLinecap="square"
            strokeMiterlimit="1.5"
            fill="none"
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
      <use
        xlinkHref="#VSK"
        height="136.8"
        width="136.8"
        x="-68.4"
        y="-68.4"
      ></use>
      <use xlinkHref="#VSK" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SSK"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VSK"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SSK"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
      </g>
    </svg>
  );
}

export default KingSpades;
