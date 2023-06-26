function TenSpades({
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
          id="SST"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z"
            fill={fill}
          ></path>
        </symbol>
        <symbol
          id="VST"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-260 430L-260 -430M-50 0L-50 -310A150 150 0 0 1 250 -310L250 310A150 150 0 0 1 -50 310Z"
            stroke={fill}
            strokeWidth="80"
            strokeLinecap="square"
            strokeMiterlimit="1.5"
            fill={background}
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
        fill="#20252e"
        stroke="black"
      ></rect>
      <use xlinkHref="#VST" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SST"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <use
        xlinkHref="#SST"
        height="54"
        width="54"
        x="-72.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SST"
        height="54"
        width="54"
        x="18.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SST"
        height="54"
        width="54"
        x="-72.167"
        y="-61.555"
      ></use>
      <use
        xlinkHref="#SST"
        height="54"
        width="54"
        x="18.167"
        y="-61.555"
      ></use>
      <use xlinkHref="#SST" height="54" width="54" x="-27" y="-96.111"></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VST"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SST"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
        <use
          xlinkHref="#SST"
          height="54"
          width="54"
          x="-72.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SST"
          height="54"
          width="54"
          x="18.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SST"
          height="54"
          width="54"
          x="-72.167"
          y="-61.555"
        ></use>
        <use
          xlinkHref="#SST"
          height="54"
          width="54"
          x="18.167"
          y="-61.555"
        ></use>
        <use xlinkHref="#SST" height="54" width="54" x="-27" y="-96.111"></use>
      </g>
    </svg>
  );
}

export default TenSpades;
