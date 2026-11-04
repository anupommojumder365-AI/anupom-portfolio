import type { ReactNode } from "react";

export function SectionHeading({
  label,
  title,
  children,
  as = "h2",
}: {
  label: string;
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className="mb-10 max-w-2xl sm:mb-12">
      <p className="eyebrow mb-4">{label}</p>
      <Heading className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {title}
      </Heading>
      {children ? (
        <p className="mt-4 leading-7 text-muted">{children}</p>
      ) : null}
    </div>
  );
}
