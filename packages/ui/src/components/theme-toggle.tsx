"use client";

import { ContrastIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import * as React from "react";
import { Label, Radio, RadioGroup } from "react-aria-components";
import { cn } from "../lib/utils.js";

/*
 * Figma contract: ThemeToggle { value: system | light | dark | high-contrast }
 *
 * "system" follows prefers-color-scheme and prefers-contrast. Any other choice
 * sets data-theme on <html> and is remembered in localStorage.
 */

export type ThemeChoice = "system" | "light" | "dark" | "high-contrast";

export const THEME_STORAGE_KEY = "graftwork-theme";

const OPTIONS: ReadonlyArray<{ value: ThemeChoice; label: string; Icon: typeof SunIcon }> = [
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "high-contrast", label: "High contrast", Icon: ContrastIcon },
];

function isThemeChoice(value: unknown): value is ThemeChoice {
  return OPTIONS.some((o) => o.value === value);
}

/** Applies a theme choice to the document. */
export function applyTheme(choice: ThemeChoice, root: HTMLElement = document.documentElement) {
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
}

function readStored(): ThemeChoice {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeChoice(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * An inline script for the document head that applies the stored theme before
 * first paint, so the page never flashes the wrong theme.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark"||t==="high-contrast")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export type ThemeToggleProps = {
  /** Controlled value. */
  value?: ThemeChoice;
  /** Uncontrolled starting value. Defaults to the stored choice, or system. */
  defaultValue?: ThemeChoice;
  onChange?: (value: ThemeChoice) => void;
  /** Visible label. Defaults to "Theme". */
  label?: string;
  className?: string;
};

/** Keeps every ThemeToggle on the page, and other tabs, in step with the stored choice. */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function ThemeToggle({ value, defaultValue, onChange, label = "Theme", className }: ThemeToggleProps) {
  // The server renders "system"; the browser then reads the stored choice without a mismatch.
  const stored = React.useSyncExternalStore(subscribe, readStored, () => "system" as const);
  const [chosen, setChosen] = React.useState<ThemeChoice | undefined>(undefined);
  const current = value ?? chosen ?? defaultValue ?? stored;

  const choose = (next: string) => {
    if (!isThemeChoice(next)) return;
    if (value === undefined) setChosen(next);
    applyTheme(next);
    try {
      if (next === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private browsing). The choice still applies for this page.
    }
    onChange?.(next);
  };

  return (
    <RadioGroup
      data-slot="theme-toggle"
      value={current}
      onChange={choose}
      orientation="horizontal"
      className={cn("flex flex-col gap-1", className)}
    >
      <Label className="text-sm font-medium text-text-default">{label}</Label>
      <div className="flex flex-wrap gap-1 rounded-md border border-border-input bg-surface-default p-1">
        {OPTIONS.map(({ value: optionValue, label: optionLabel, Icon }) => (
          <Radio
            key={optionValue}
            value={optionValue}
            className={cn(
              "flex min-h-target-min cursor-pointer items-center gap-1 rounded-sm px-3 text-sm text-text-default",
              "transition-colors duration-(--gw-motion-duration-fast) hover:bg-action-ghost-bg-hover",
              "data-selected:bg-action-primary-bg data-selected:text-text-on-primary",
              "data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:outline-offset-2 data-focus-visible:outline-focus-ring",
            )}
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            {optionLabel}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}
