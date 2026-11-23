/*
 * Browsers move focus but skip focus events while a window is unfocused, as in an embedded
 * preview. Play functions and React Aria need those events, so send them here. Automated
 * browsers always have focus events, so CI runs without this.
 */
export function emulateWindowFocus() {
  if (typeof window === "undefined" || navigator.webdriver) return;

  const moveFocus = (from: Element | null, to: Element | null) => {
    if (from && from !== document.body) {
      from.dispatchEvent(new FocusEvent("blur", { relatedTarget: to }));
      from.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: to }));
    }
    if (to && to !== document.body) {
      to.dispatchEvent(new FocusEvent("focus", { relatedTarget: from }));
      to.dispatchEvent(new FocusEvent("focusin", { bubbles: true, relatedTarget: from }));
    }
  };

  for (const prototype of [HTMLElement.prototype, SVGElement.prototype]) {
    const { focus, blur } = prototype;
    prototype.focus = function (this: HTMLElement, options?: FocusOptions) {
      const previous = document.activeElement;
      focus.call(this, options);
      if (!document.hasFocus() && document.activeElement === this && previous !== this) moveFocus(previous, this);
    };
    prototype.blur = function (this: HTMLElement) {
      const wasActive = document.activeElement === this;
      blur.call(this);
      if (!document.hasFocus() && wasActive) moveFocus(this, null);
    };
  }
}
