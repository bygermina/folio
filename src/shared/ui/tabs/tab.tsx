import { useEffect } from 'react';

import { Button } from '@/shared/ui/button/button';

import { useTabsContext } from './tabs-context';
import { type TabProps } from './tabs.types';

export const Tab = ({
  value,
  children,
  className,
  disabled,
  onMouseEnter,
  onMouseLeave,
}: TabProps) => {
  const { activeTab, setActiveTab, baseId, registerTab, unregisterTab } = useTabsContext();
  const isActive = activeTab === value;

  useEffect(() => {
    registerTab(value);
    return () => {
      unregisterTab(value);
    };
  }, [value, registerTab, unregisterTab]);

  const handleClick = () => {
    if (!disabled) setActiveTab(value);
  };

  return (
    <Button
      id={`${baseId}-tab-${value}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      variant="tab"
      size="sm"
      isActive={isActive}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Button>
  );
};
