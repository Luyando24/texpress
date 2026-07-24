type BoltMarkProps = {
  inverse?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function BoltMark({ inverse = false, size = "md" }: BoltMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block font-black leading-none ${sizes[size]} ${
        inverse ? "text-ink-950" : "text-thunder-400"
      }`}
    >
      ⚡
    </span>
  );
}
