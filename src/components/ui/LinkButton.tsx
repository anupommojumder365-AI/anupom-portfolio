import type { ComponentProps } from "react";
import { Link } from "react-router";
type Props = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};
export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <Link className={`button button-${variant} ${className}`} {...props} />
  );
}
