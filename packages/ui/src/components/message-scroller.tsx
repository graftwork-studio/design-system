"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";

/*
 * Adapted from shadcn/ui's Message Scroller. Copyright (c) 2023 shadcn. MIT licence.
 * Built here rather than on @shadcn/react, which is pre-1.0.
 *
 * Figma contract: MessageScroller, MessageScrollerViewport { aria-label }, MessageScrollerContent, MessageScrollerItem,
 *                 MessageScrollerButton { direction: start | end }
 *
 * Follows new content while the reader is at the end, and stops as soon as they
 * scroll up. The viewport is a live log, so screen readers hear new messages.
 */

const END_THRESHOLD = 24;

type MessageScrollerContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  isAtStart: boolean;
  isAtEnd: boolean;
  isFollowingRef: React.RefObject<boolean>;
  update: () => void;
  scrollToStart: () => void;
  scrollToEnd: () => void;
};

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

/** Scroll position and controls for the nearest MessageScroller. */
export function useMessageScroller() {
  const context = React.useContext(MessageScrollerContext);
  if (!context) throw new Error("useMessageScroller must be used within a MessageScroller.");
  return context;
}

export function MessageScroller({ className, ...props }: React.ComponentProps<"div">) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const isFollowingRef = React.useRef(true);
  const [position, setPosition] = React.useState({ isAtStart: true, isAtEnd: true });

  const update = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const isAtStart = viewport.scrollTop <= END_THRESHOLD;
    const isAtEnd = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= END_THRESHOLD;
    isFollowingRef.current = isAtEnd;
    setPosition((current) => (current.isAtStart === isAtStart && current.isAtEnd === isAtEnd ? current : { isAtStart, isAtEnd }));
  }, []);

  const scrollToStart = React.useCallback(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
    update();
  }, [update]);

  const scrollToEnd = React.useCallback(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    update();
  }, [update]);

  const value = React.useMemo(
    () => ({ viewportRef, isFollowingRef, update, scrollToStart, scrollToEnd, ...position }),
    [update, scrollToStart, scrollToEnd, position],
  );

  return (
    <MessageScrollerContext.Provider value={value}>
      <div data-slot="message-scroller" className={cn("relative flex size-full min-h-0 flex-col overflow-hidden", className)} {...props} />
    </MessageScrollerContext.Provider>
  );
}

export type MessageScrollerViewportProps = React.ComponentProps<"div"> & {
  /** Names the conversation for screen readers. Required. */
  "aria-label": string;
};

export function MessageScrollerViewport({ className, onScroll, ...props }: MessageScrollerViewportProps) {
  const { viewportRef, update } = useMessageScroller();
  return (
    <div
      ref={viewportRef}
      role="log"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard users need to scroll the conversation (WCAG 2.1.1).
      tabIndex={0}
      data-slot="message-scroller-viewport"
      onScroll={(event) => {
        update();
        onScroll?.(event);
      }}
      className={cn(
        "focus-ring size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain [scrollbar-color:var(--gw-color-border-input)_transparent] [scrollbar-width:thin]",
        className,
      )}
      {...props}
    />
  );
}

export function MessageScrollerContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewportRef, isFollowingRef, scrollToEnd, update } = useMessageScroller();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content || !viewportRef.current) return;
    const observer = new ResizeObserver(() => {
      if (isFollowingRef.current) scrollToEnd();
      else update();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [viewportRef, isFollowingRef, scrollToEnd, update]);

  return <div ref={contentRef} data-slot="message-scroller-content" className={cn("flex h-max min-h-full flex-col gap-6", className)} {...props} />;
}

export function MessageScrollerItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-scroller-item" className={cn("min-w-0 shrink-0", className)} {...props} />;
}

export type MessageScrollerButtonProps = Omit<ButtonProps, "children"> & {
  /** Which way it scrolls. Defaults to end. */
  direction?: "start" | "end";
  children?: React.ReactNode;
};

/** Appears when there's more to read in that direction. */
export function MessageScrollerButton({ direction = "end", className, children, onPress, ...props }: MessageScrollerButtonProps) {
  const { viewportRef, isAtStart, isAtEnd, scrollToStart, scrollToEnd } = useMessageScroller();
  if (direction === "end" ? isAtEnd : isAtStart) return null;
  const Icon = direction === "end" ? ArrowDownIcon : ArrowUpIcon;
  return (
    <Button
      data-slot="message-scroller-button"
      data-direction={direction}
      variant="secondary"
      size="sm"
      aria-label={direction === "end" ? "Scroll to latest message" : "Scroll to first message"}
      className={cn(
        "absolute! start-1/2 z-10 w-7 -translate-x-1/2 px-0 shadow-sm rtl:translate-x-1/2",
        direction === "end" ? "bottom-3" : "top-3",
        className,
      )}
      onPress={(event) => {
        onPress?.(event);
        if (direction === "end") scrollToEnd();
        else scrollToStart();
        // The button disappears once it has scrolled, so keep focus somewhere useful.
        viewportRef.current?.focus();
      }}
      {...props}
    >
      {children ?? <Icon aria-hidden />}
    </Button>
  );
}
