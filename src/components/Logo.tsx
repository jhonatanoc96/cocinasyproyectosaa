/**
 * Cocinas y Proyectos AA monogram: two "A" joined by a walnut bar that reads
 * as a kitchen countertop. Same drawing as app/icon.svg (the favicon).
 */
export function LogoMarca({
  className = "",
  fondo = false,
}: {
  className?: string;
  /** Dark rounded square behind the letters (as in the favicon). */
  fondo?: boolean;
}) {
  const id = fondo ? "aa-clip-f" : "aa-clip";
  return (
    <svg
      viewBox={fondo ? "0 0 64 64" : "9 13 46 37"}
      className={className}
      aria-hidden
      focusable="false"
    >
      {fondo && <rect width="64" height="64" rx="14" fill="#161412" />}
      <clipPath id={id}>
        <rect x="0" y="0" width="64" height="47" />
      </clipPath>
      <path
        clipPath={`url(#${id})`}
        d="M10.5 52 L22 16.5 L32 47.5 L42 16.5 L53.5 52"
        fill="none"
        stroke={fondo ? "#f4f1ec" : "currentColor"}
        strokeWidth="3.2"
        strokeLinejoin="miter"
        strokeMiterlimit="12"
      />
      <path d="M11 35 H53" stroke="#b98b66" strokeWidth="3.2" />
    </svg>
  );
}
