import React from "react";
import * as LucideIcons from "lucide-react";

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  /** Accessible label. Omit for purely decorative icons (hidden from screen readers). */
  label?: string;
}

export default function Icon({ name, size = 20, className = "", label }: IconProps) {
  const IconComponent = LucideIcons[name] as React.ComponentType<any>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span
      className={`icon-wrapper ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <IconComponent
        size={size}
        className="inline-icon"
        aria-hidden="true"
        focusable="false"
        style={{
          verticalAlign: "middle",
          marginRight: "0.5rem",
          strokeWidth: 2,
        }}
      />
    </span>
  );
}
