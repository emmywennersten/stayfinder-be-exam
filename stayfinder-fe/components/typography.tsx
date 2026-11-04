import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn";

//? Inherited prop types from Paragraph element
type HeaderProps = ComponentPropsWithoutRef<"p"> & {
  size?: "sm" | "md" | "lg";
};

const T = {
  Header: ({ children, size, className, ...props }: HeaderProps) => {
    const classes = cn(
      "font-bold",
      {
        "text-lg": size === "sm",
        "text-xl": size === "md",
        "text-2xl": size === "lg",
      },
      className,
    );
    return (
      <p className={classes} {...props}>
        {children}
      </p>
    );
  },
};

export default T;
