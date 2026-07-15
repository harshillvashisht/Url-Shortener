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
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-white
        font-medium
        transition
        hover:bg-blue-700
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