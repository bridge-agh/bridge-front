function Back({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      viewBox="-106 -164.5 212 329"
    >
      <rect
        width="211"
        height="328"
        x="-105.5"
        y="-164"
        rx="19"
        ry="19"
        fill={fill}
      ></rect>
    </svg>
  );
}

export default Back;