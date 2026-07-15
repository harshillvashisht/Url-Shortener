// src/components/common/Input.tsx

import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-2
          outline-none
          transition
          focus:border-blue-500
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;