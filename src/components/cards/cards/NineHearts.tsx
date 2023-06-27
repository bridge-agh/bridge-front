function NineHearts({
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
          id="SH9"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M0 -300C0 -400 100 -500 200 -500C300 -500 400 -400 400 -250C400 0 0 400 0 500C0 400 -400 0 -400 -250C-400 -400 -300 -500 -200 -500C-100 -500 0 -400 -0 -300Z"
            fill={fill}
          ></path>
        </symbol>
        <symbol
          id="VH9"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M250 -100A250 250 0 0 1 -250 -100L-250 -210A250 250 0 0 1 250 -210L250 210A250 250 0 0 1 0 460C-150 460 -180 400 -200 375"
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
      <use xlinkHref="#VH9" height="32" width="32" x="-100.4" y="-145.5"></use>
      <use
        xlinkHref="#SH9"
        height="26.769"
        width="26.769"
        x="-97.784"
        y="-108.5"
      ></use>
      <use
        xlinkHref="#SH9"
        height="54"
        width="54"
        x="-72.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SH9"
        height="54"
        width="54"
        x="18.167"
        y="-130.667"
      ></use>
      <use
        xlinkHref="#SH9"
        height="54"
        width="54"
        x="-72.167"
        y="-61.555"
      ></use>
      <use
        xlinkHref="#SH9"
        height="54"
        width="54"
        x="18.167"
        y="-61.555"
      ></use>
      <use xlinkHref="#SH9" height="54" width="54" x="-27" y="-27"></use>
      <g transform="rotate(180)">
        <use
          xlinkHref="#VH9"
          height="32"
          width="32"
          x="-100.4"
          y="-145.5"
        ></use>
        <use
          xlinkHref="#SH9"
          height="26.769"
          width="26.769"
          x="-97.784"
          y="-108.5"
        ></use>
        <use
          xlinkHref="#SH9"
          height="54"
          width="54"
          x="-72.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SH9"
          height="54"
          width="54"
          x="18.167"
          y="-130.667"
        ></use>
        <use
          xlinkHref="#SH9"
          height="54"
          width="54"
          x="-72.167"
          y="-61.555"
        ></use>
        <use
          xlinkHref="#SH9"
          height="54"
          width="54"
          x="18.167"
          y="-61.555"
        ></use>
      </g>
    </svg>
  );
}

export default NineHearts;