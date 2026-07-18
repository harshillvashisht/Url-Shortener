// src/components/common/Button.tsx

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        w-full
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-blue-600
        px-4
        py-2.5
        text-white
        text-sm
        font-semibold
        shadow-sm
        shadow-blue-600/20
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-blue-700
        hover:shadow-md
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white
        active:translate-y-0
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}