"use client";

import type * as React from "react";
import { I18nProvider, useLocale } from "react-aria-components";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Sets text direction for everything inside it. Pass a locale such as "ar-AE"
 * when you know the language, so dates and numbers are formatted for it too.
 */

export type DirectionProviderProps = {
  /** Forces a direction while keeping the current language. */
  direction?: "ltr" | "rtl";
  /** A BCP 47 language tag, like "ar-AE". */
  locale?: string;
  children: React.ReactNode;
};

export function DirectionProvider({ direction, locale, children }: DirectionProviderProps) {
  const current = useLocale();
  const resolved =
    locale ?? (direction && direction !== current.direction ? new Intl.Locale(current.locale, { script: direction === "rtl" ? "Arab" : "Latn" }).toString() : current.locale);
  return (
    <I18nProvider locale={resolved}>
      <DirectionRoot direction={direction}>{children}</DirectionRoot>
    </I18nProvider>
  );
}

function DirectionRoot({ direction, children }: { direction?: "ltr" | "rtl"; children: React.ReactNode }) {
  const locale = useLocale();
  return (
    <div data-slot="direction" dir={direction ?? locale.direction} className="contents">
      {children}
    </div>
  );
}

/** The current text direction: "ltr" or "rtl". */
export function useDirection(): "ltr" | "rtl" {
  return useLocale().direction;
}
