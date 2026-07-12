import React from "react";
import Link from "@docusaurus/Link";
import Icon from "@site/src/components/Icon";
import type * as LucideIcons from "lucide-react";

interface JourneyCardProps {
  /** Internal route (e.g. "/quickstart") or external URL. */
  to: string;
  title: string;
  /** Lucide icon name, e.g. "Rocket". */
  icon?: keyof typeof LucideIcons;
  children?: React.ReactNode;
}

export function JourneyCard({ to, title, icon, children }: JourneyCardProps) {
  return (
    <Link to={to} className="journey-card">
      <span className="journey-card__header">
        {icon && (
          <span className="journey-card__icon">
            <Icon name={icon} size={22} />
          </span>
        )}
        <span className="journey-card__title">{title}</span>
      </span>
      {children && <div className="journey-card__description">{children}</div>}
    </Link>
  );
}

export function JourneyCards({ children }: { children: React.ReactNode }) {
  return <div className="journey-cards">{children}</div>;
}

export default JourneyCard;
