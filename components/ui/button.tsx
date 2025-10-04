import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center font-semibold justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary stroke-primary-foreground text-primary-foreground hover:bg-primary/90",
        green:
          "bg-whatsapp stroke-primary-foreground text-primary-foreground hover:bg-whatsapp/90",
        reversed:
          "bg-foreground stroke-background text-background hover:bg-foreground/90 border border-border/25",
        destructive:
          "bg-destructive stroke-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive",
        outline:
          "border border-input bg-background hover:bg-accent stroke-accent-foreground text-accent-foreground",
        outline_primary:
          "border border-primary bg-background hover:bg-accent stroke-accent-foreground text-primary",
        secondary:
          "bg-secondary stroke-secondary-foreground text-secondary-foreground hover:bg-secondary/90",
        ghost:
          "hover:bg-accent stroke-accent-foreground text-accent-foreground",
        link: "stroke-primary text-primary underline-offset-4 hover:underline",
        sorting:
          "stroke-accent-foreground bg-transparent hover:bg-transparent text-foreground-muted hover:text-foreground",
      },
      size: {
        default: "h-fit px-4 py-2 gap-2",
        sm: "h-9 rounded-md px-3 text-[14px] leading-[20px] gap-1", // For some reason applying styles like "text-subtle" will prevent applying the color styles from the variants above
        lg: "h-11 rounded-md px-4 gap-2",
        icon: "h-10 w-10",
        sorting: "p-0",
        link: "p-0 bg-transparent hover:bg-transparent border-transparent",
        input: "h-10 rounded-md px-4 py-2 gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
