import { type ReactNode } from 'react';

export interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}
