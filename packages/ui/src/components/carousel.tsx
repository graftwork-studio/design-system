"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { useLocale } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";

/*
 * Adapted from shadcn/ui (aria-nova). Copyright (c) 2023 shadcn. MIT licence.
 *
 * Figma contract: see the naming contract in apps/docs/src/introduction.mdx.
 *
 * Slides people move through themselves, by swiping, with the buttons, or with
 * arrow keys. It never advances by itself. Under reduced motion it jumps.
 */

export type CarouselApi = UseEmblaCarouselType[1];
type EmblaParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = EmblaParameters[0];
export type CarouselPlugin = EmblaParameters[1];

type CarouselContextValue = {
  carouselRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  orientation: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a Carousel.");
  return context;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isEditable(target: EventTarget) {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

export type CarouselProps = Omit<React.ComponentProps<"div">, "aria-label"> & {
  /** Says what the slides are. Required. */
  "aria-label": string;
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  /** Defaults to horizontal. */
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

export function Carousel({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }: CarouselProps) {
  const { direction } = useLocale();
  const [carouselRef, api] = useEmblaCarousel({ align: "start", direction, ...opts, axis: orientation === "horizontal" ? "x" : "y" }, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(prefersReducedMotion()), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(prefersReducedMotion()), [api]);

  React.useEffect(() => {
    if (api) setApi?.(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    update();
    api.on("reInit", update);
    api.on("select", update);
    return () => {
      api.off("reInit", update);
      api.off("select", update);
    };
  }, [api]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isEditable(event.target)) return;
    const previous = orientation === "vertical" ? "ArrowUp" : direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    const next = orientation === "vertical" ? "ArrowDown" : direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    if (event.key === previous) {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === next) {
      event.preventDefault();
      scrollNext();
    }
  };

  const value = React.useMemo(
    () => ({ carouselRef, api, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext }),
    [carouselRef, api, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext],
  );

  return (
    <CarouselContext.Provider value={value}>
      <div role="region" aria-roledescription="carousel" data-slot="carousel" onKeyDownCapture={onKeyDown} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} data-slot="carousel-content" className="overflow-hidden">
      <div className={cn("flex", orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col", className)} {...props} />
    </div>
  );
}

export type CarouselItemProps = Omit<React.ComponentProps<"div">, "aria-label"> & {
  /** Names the slide, like "Slide 1 of 3". Required. */
  "aria-label": string;
};

export function CarouselItem({ className, ...props }: CarouselItemProps) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "ps-4" : "pt-4", className)}
      {...props}
    />
  );
}

const control = "absolute! z-10 w-7 rounded-full px-0 shadow-sm";

export function CarouselPrevious({ className, variant = "secondary", size = "sm", ...props }: ButtonProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      aria-label="Previous slide"
      isDisabled={!canScrollPrev}
      onPress={scrollPrev}
      className={cn(control, orientation === "horizontal" ? "inset-y-0 start-2 my-auto" : "start-1/2 top-2 -translate-x-1/2 rotate-90", className)}
      {...props}
    >
      <ChevronLeftIcon aria-hidden className="rtl:rotate-180" />
    </Button>
  );
}

export function CarouselNext({ className, variant = "secondary", size = "sm", ...props }: ButtonProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      aria-label="Next slide"
      isDisabled={!canScrollNext}
      onPress={scrollNext}
      className={cn(control, orientation === "horizontal" ? "inset-y-0 end-2 my-auto" : "start-1/2 bottom-2 -translate-x-1/2 rotate-90", className)}
      {...props}
    >
      <ChevronRightIcon aria-hidden className="rtl:rotate-180" />
    </Button>
  );
}
