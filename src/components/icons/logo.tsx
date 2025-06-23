import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 9 9v-2" />
      <path d="M13 4a7 7 0 0 1 7 7h2a9 9 0 0 0-9-9v2" />
      <path d="M12 12a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Z" />
      <path d="M16.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  );
}
