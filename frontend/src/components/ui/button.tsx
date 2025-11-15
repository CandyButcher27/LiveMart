import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* 🌈 Modern Glassmorphism Button Variants */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "btn-primary shadow-lg shadow-blue-500/20 hover:scale-[1.03]",
        glass:
          "glass-card px-4 py-2 text-white hover:bg-white/20 hover:scale-[1.02]",
        outline:
          "border border-white/30 text-white px-4 py-2 hover:bg-white/10 hover:scale-[1.02] backdrop-blur-xl",
        ghost:
          "text-white px-3 py-2 hover:bg-white/10 hover:text-blue-400",
        danger:
          "bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 shadow-red-500/30 hover:scale-[1.03]",
        subtle:
          "bg-slate-800/50 text-white px-4 py-2 border border-slate-700 hover:bg-slate-700/40 rounded-xl",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
