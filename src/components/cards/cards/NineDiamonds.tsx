function NineDiamonds({
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
          id="SD9"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-400 0C-350 0 0 -450 0 -500C0 -450 350 0 400 0C350 0 0 450 0 500C0 450 -350 0 -400 0Z"
            fill={fill}
          ></path>
        </symbol>
        <symbol
          id="VD9"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M250 -100A250 250 0 0 1 -250 -100L-250 -210A250 250 0 0 1 250 -210L250 210A250 250 0 0 1 0 460C-150 460 -180 400 -200 375"
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
      <use xlinkHref="#VD9" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SD9"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <use
        xlinkHref="#SD9"
        height="54"
        width="54"
        x="-72.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SD9"
        height="54"
        width="54"
        x="18.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SD9"
        height="54"
        width="54"
        x="-72.167"
        y="-61.555"
      ></use>
      <use xlinkHref="#SD9" height="54" width="54" x="18.167" y="-61.555"></use>
      <use xlinkHref="#SD9" height="54" width="54" x="-27" y="-27"></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VD9"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SD9"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
        <use
          xlinkHref="#SD9"
          height="54"
          width="54"
          x="-72.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SD9"
          height="54"
          width="54"
          x="18.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SD9"
          height="54"
          width="54"
          x="-72.167"
          y="-61.555"
        ></use>
        <use
          xlinkHref="#SD9"
          height="54"
          width="54"
          x="18.167"
          y="-61.555"
        ></use>
      </g>
    </svg>
  );
}

export default NineDiamonds;
