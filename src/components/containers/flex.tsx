interface FlexInterface {
  children: React.ReactNode | React.ReactNode[];
  direction?: "row" | "column";
  gap?: number | null;
  justify?:
    | "center"
    | "space-between"
    | "space-around"
    | "flex-start"
    | "flex-end";
  align?: "center" | "flex-start" | "flex-end" | "normal";
  fullWidth?: boolean;
  fullHeight?: boolean;
  className?: string;
}

export default function Flex({
  children,
  direction = "row",
  gap = null,
  justify = "center",
  align = "center",
  fullWidth = false,
  fullHeight = false,
  className = "",
}: FlexInterface) {
  return (
    <div
      className={`
        ${className} 
        flex ${direction} ${justify} ${align} 
        ${fullWidth ? "w-full" : "auto"} ${fullHeight ? "h-full" : "auto"} 
        ${gap ? `gap-[${gap}px]` : ""}`
      }
    >
      {children}
    </div>
  );
}
