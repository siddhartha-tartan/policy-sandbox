import React, { useState } from "react";
import "./tabSwitcher.css";

export enum TabsVariant {
  DEFAULT = "default",
  PILL = "pill",
  BOXED = "boxed",
}

export interface TabSwitchItem<T extends React.Key> {
  key: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactElement;
}

export interface CustomTabsSwitchProps<T extends React.Key> {
  tabs: TabSwitchItem<T>[];
  defaultValue?: T;
  value?: T;
  onChange?: (key: T) => void;
  parentClassName?: string;
  childClassName?: string;
  variant?: TabsVariant;
}

export default function CustomTabsSwitch<T extends React.Key>({
  tabs,
  defaultValue = tabs[0]?.key,
  value,
  onChange,
  parentClassName = "",
  childClassName = "",
  variant = TabsVariant.DEFAULT,
}: CustomTabsSwitchProps<T>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeKey = isControlled ? value : internalValue;

  const handleClick = (tab: TabSwitchItem<T>) => {
    if (tab.disabled) {
      return;
    }
    if (!isControlled) {
      setInternalValue(tab.key);
    }
    onChange?.(tab.key);
  };

  return (
    <div
      className={`custom-tabs-container variant-${variant} ${parentClassName}`}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleClick(tab)}
          disabled={tab.disabled}
          className={`tab-item ${activeKey === tab.key ? "active" : ""} ${
            tab.disabled ? "disabled" : ""
          } ${childClassName}`}
          role="tab"
          aria-selected={activeKey === tab.key}
        >
          {tab.icon && <span className="icon">{tab.icon}</span>}
          <span className="label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
