/**
 * Sidebar component types.
 */

import type { ReactNode } from "react";
import type { SectionKey } from "./layout";

export type SidebarSection = {
  key: SectionKey;
  label: string;
  icon: ReactNode;
  items: { href: string; label: string; icon?: ReactNode }[];
};

export type SidebarProps = {
  sections: SidebarSection[];
  activeSection: SectionKey;
  onActiveSectionChange: (key: SectionKey) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};
