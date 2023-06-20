function DiamondsSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="325.125 158.022 54 54"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <defs>
        <symbol
          id="DS"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M-400 0C-350 0 0 -450 0 -500C0 -450 350 0 400 0C350 0 0 450 0 500C0 450 -350 0 -400 0Z"
            fill=""
          />
        </symbol>
      </defs>
      <use
        height="54"
        width="54"
        transform="matrix(1, 0, 0, 1, 325.124725, 158.022034)"
        xlinkHref="#DS"
      />
    </svg>
  );
}

export default DiamondsSymbol;
