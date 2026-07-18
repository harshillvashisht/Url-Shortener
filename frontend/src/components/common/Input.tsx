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
          min-h-11
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-2.5
          text-sm
          text-slate-900
          placeholder:text-slate-400
          shadow-sm
          outline-none
          transition
          duration-200
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-500/10
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:text-slate-500
          disabled:opacity-70
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;