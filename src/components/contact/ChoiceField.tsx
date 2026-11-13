import { useId } from "react";

export function ChoiceField({
  label,
  name,
  options,
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  options: readonly string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <fieldset
      className="mb-5"
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={Boolean(error)}
    >
      <legend className="mb-2 text-sm font-semibold">
        {label}
        <span className="text-accent" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="chip">
            <input
              required
              type="radio"
              className="sr-only"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
