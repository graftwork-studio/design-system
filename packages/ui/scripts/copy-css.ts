// Copies the stylesheet into dist so apps can import "@graftwork/ui/styles.css".
import { copyFileSync } from "node:fs";

copyFileSync(new URL("../src/styles.css", import.meta.url), new URL("../dist/styles.css", import.meta.url));
