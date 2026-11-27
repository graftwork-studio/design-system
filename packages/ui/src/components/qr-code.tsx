import qrcode from "qrcode-generator";
import * as React from "react";
import { cn } from "../lib/utils.js";

/*
 * Figma contract: QrCode { value; size: sm | md | lg }
 *
 * A QR code for a link or short text, such as pairing a phone.
 *
 * Accessibility:
 * - the code is an image named by `label`, which says what scanning it does
 *   ("QR code to connect your phone"). A screen reader can't scan it, so always
 *   offer another way to do the same thing nearby, such as a link or a code to type
 * - scanners need dark modules on a light ground: many can't read inverted codes.
 *   So the tile always uses the light theme's tokens (text-default on
 *   surface-raised, 20:1), in dark and high-contrast themes too
 * - a quiet zone of 4 modules surrounds the code, as the QR standard requires, so
 *   it scans against any background
 * - error correction is M (15%), so a smudge or glare doesn't stop it scanning
 */

const sizes = { sm: 128, md: 160, lg: 224 } as const;

export type QrCodeSize = keyof typeof sizes;

export type QrCodeProps = {
  /** The text or link to encode. */
  value: string;
  /** The image's accessible name: say what scanning the code does. */
  label: string;
  /** Width and height, including the quiet zone: sm 128px, md 160px, lg 224px. Defaults to md. */
  size?: QrCodeSize;
  className?: string;
};

const QUIET_ZONE = 4;

/** The library reads one byte per character, so encode as UTF-8 first. */
function utf8(value: string) {
  return String.fromCharCode(...new TextEncoder().encode(value));
}

function modulePath(value: string) {
  const code = qrcode(0, "M");
  code.addData(utf8(value), "Byte");
  code.make();
  const count = code.getModuleCount();
  let path = "";
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (code.isDark(row, col)) path += `M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`;
    }
  }
  return { path, extent: count + QUIET_ZONE * 2 };
}

export function QrCode({ value, label, size = "md", className }: QrCodeProps) {
  const { path, extent } = React.useMemo(() => modulePath(value), [value]);
  const px = sizes[size];
  return (
    <div
      data-slot="qr-code"
      data-theme="light"
      className={cn("inline-flex shrink-0 overflow-hidden rounded-md bg-surface-raised", className)}
    >
      <svg
        role="img"
        aria-label={label}
        width={px}
        height={px}
        viewBox={`0 0 ${extent} ${extent}`}
        shapeRendering="crispEdges"
        className="fill-text-default"
      >
        <path d={path} />
      </svg>
    </div>
  );
}
