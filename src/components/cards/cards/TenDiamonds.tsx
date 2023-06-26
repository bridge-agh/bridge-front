function TenDiamonds({
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
          id="SDT"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-400 0C-350 0 0 -450 0 -500C0 -450 350 0 400 0C350 0 0 450 0 500C0 450 -350 0 -400 0Z"
            fill={fill}
          ></path>
        </symbol>
        <symbol
          id="VDT"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-260 430L-260 -430M-50 0L-50 -310A150 150 0 0 1 250 -310L250 310A150 150 0 0 1 -50 310Z"
            stroke="#ff3838"
            stroke-width="80"
            stroke-linecap="square"
            stroke-miterlimit="1.5"
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
      <use xlinkHref="#VDT" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SDT"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <use
        xlinkHref="#SDT"
        height="54"
        width="54"
        x="-72.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SDT"
        height="54"
        width="54"
        x="18.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SDT"
        height="54"
        width="54"
        x="-72.167"
        y="-61.555"
      ></use>
      <use
        xlinkHref="#SDT"
        height="54"
        width="54"
        x="18.167"
        y="-61.555"
      ></use>
      <use xlinkHref="#SDT" height="54" width="54" x="-27" y="-96.111"></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VDT"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SDT"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
        <use
          xlinkHref="#SDT"
          height="54"
          width="54"
          x="-72.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SDT"
          height="54"
          width="54"
          x="18.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SDT"
          height="54"
          width="54"
          x="-72.167"
          y="-61.555"
        ></use>
        <use
          xlinkHref="#SDT"
          height="54"
          width="54"
          x="18.167"
          y="-61.555"
        ></use>
        <use xlinkHref="#SDT" height="54" width="54" x="-27" y="-96.111"></use>
      </g>
    </svg>
  );
}

export default TenDiamonds;
