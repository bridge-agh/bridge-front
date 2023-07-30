function HeartsSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="223 223 54 54"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <defs>
        <symbol
          id="HS"
          viewBox="-600 -600 1200 1200"
          preserveAspectRatio="xMinYMid"
        >
          <path
            d="M 0.001 -286.123 C 0.001 -381.496 119.978 -476.87 239.954 -476.87 C 359.931 -476.87 479.907 -381.496 479.907 -238.436 C 479.907 -0.001 0.001 381.495 0.001 476.869 C 0.001 381.495 -479.906 -0.001 -479.906 -238.436 C -479.906 -381.496 -359.929 -476.87 -239.953 -476.87 C -119.976 -476.87 0.001 -381.496 0.001 -286.123 Z"
            fill=""
          />
        </symbol>
      </defs>
      <use
        height="54"
        width="54"
        transform="matrix(1, 0, 0, 1, 223, 223)"
        xlinkHref="#HS"
      />
    </svg>
  );
}

export default HeartsSymbol;
