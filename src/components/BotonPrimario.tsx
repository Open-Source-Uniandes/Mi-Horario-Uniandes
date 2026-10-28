import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BotonPrimarioProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function BotonPrimario({
  children,
  className,
  type = "button",
  ...props
}: BotonPrimarioProps) {
  return (
    <button
      type={type}
      className={cn(
        "primary-action",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
