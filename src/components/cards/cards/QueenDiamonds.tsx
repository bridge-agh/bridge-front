function QueenDiamonds({
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
          id="SDQ"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-400 0C-350 0 0 -450 0 -500C0 -450 350 0 400 0C350 0 0 450 0 500C0 450 -350 0 -400 0Z"
            fill={fill}
          ></path>
        </symbol>
        <symbol
          id="VDQ"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-260 100C40 100 -40 460 260 460M-175 0L-175 -285A175 175 0 0 1 175 -285L175 285A175 175 0 0 1 -175 285Z"
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
        xlinkHref="#VDQ"
        height="136.8"
        width="136.8"
        x="-68.4"
        y="-68.4"
      ></use>
      <use xlinkHref="#VDQ" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SDQ"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VDQ"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SDQ"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
      </g>
    </svg>
  );
}

export default QueenDiamonds;
