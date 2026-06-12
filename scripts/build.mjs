import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function deepMerge(base, override) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !("$value" in value)
    ) {
      out[key] = deepMerge(base[key] ?? {}, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function flattenTokens(obj, prefix = []) {
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    const path = [...prefix, key];
    if (value && typeof value === "object" && "$value" in value) {
      entries.push({
        path,
        name: path.join("-"),
        cssVar: `--${path.join("-")}`,
        value: value.$value,
        type: value.$type ?? "string",
        description: value.$description ?? "",
      });
    } else if (value && typeof value === "object") {
      entries.push(...flattenTokens(value, path));
    }
  }
  return entries;
}

function cssVarBlock(entries, selector = ":root") {
  const lines = entries.map((e) => {
    const comment = e.description ? ` /* ${e.description} */` : "";
    return `  ${e.cssVar}: ${e.value};${comment}`;
  });
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}

function lightDarkCss(entries) {
  const lightKeys = new Set([
    "color-light-background",
    "color-light-background-subtle",
    "color-light-foreground",
    "color-light-foreground-muted",
    "color-light-card",
    "color-light-card-foreground",
    "color-light-border",
    "color-light-border-strong",
    "color-light-ring",
  ]);

  const darkKeys = new Set([
    "color-dark-background",
    "color-dark-background-subtle",
    "color-dark-foreground",
    "color-dark-foreground-muted",
    "color-dark-card",
    "color-dark-card-foreground",
    "color-dark-border",
    "color-dark-border-strong",
    "color-dark-ring",
    "color-dark-neon-glow",
  ]);

  const semanticAliases = [
    ["background", "color-light-background"],
    ["background-subtle", "color-light-background-subtle"],
    ["foreground", "color-light-foreground"],
    ["foreground-muted", "color-light-foreground-muted"],
    ["card", "color-light-card"],
    ["card-foreground", "color-light-card-foreground"],
    ["border", "color-light-border"],
    ["border-strong", "color-light-border-strong"],
    ["ring", "color-light-ring"],
    ["brand-primary", "color-brand-primary"],
    ["brand-primary-hover", "color-brand-primary-hover"],
    ["brand-primary-foreground", "color-brand-primary-foreground"],
    ["brand-secondary", "color-brand-secondary"],
    ["brand-secondary-foreground", "color-brand-secondary-foreground"],
  ];

  const darkSemanticAliases = [
    ["background", "color-dark-background"],
    ["background-subtle", "color-dark-background-subtle"],
    ["foreground", "color-dark-foreground"],
    ["foreground-muted", "color-dark-foreground-muted"],
    ["card", "color-dark-card"],
    ["card-foreground", "color-dark-card-foreground"],
    ["border", "color-dark-border"],
    ["border-strong", "color-dark-border-strong"],
    ["ring", "color-dark-ring"],
  ];

  const byName = new Map(entries.map((e) => [e.name, e]));

  const rootLines = entries
    .filter((e) => !lightKeys.has(e.name) && !darkKeys.has(e.name))
    .map((e) => `  ${e.cssVar}: ${e.value};`);

  for (const [alias, source] of semanticAliases) {
    const src = byName.get(source);
    if (src) rootLines.push(`  --color-${alias}: var(${src.cssVar});`);
  }

  const darkLines = [];
  for (const [alias, source] of darkSemanticAliases) {
    const src = byName.get(source);
    if (src) darkLines.push(`  --color-${alias}: var(${src.cssVar});`);
  }

  const lightOnly = entries.filter((e) => lightKeys.has(e.name));
  for (const e of lightOnly) {
    rootLines.push(`  ${e.cssVar}: ${e.value};`);
  }

  const darkOnly = entries.filter((e) => darkKeys.has(e.name));
  for (const e of darkOnly) {
    if (!darkLines.some((l) => l.startsWith(`  ${e.cssVar}:`))) {
      darkLines.push(`  ${e.cssVar}: ${e.value};`);
    }
  }

  return [
    ":root {",
    ...rootLines,
    "",
    "  color-scheme: light;",
    "  font-family: var(--font-family-sans);",
    "  background-color: var(--color-background);",
    "  color: var(--color-foreground);",
    "}",
    "",
    ".dark, [data-theme='dark'] {",
    ...darkLines,
    "",
    "  color-scheme: dark;",
    "}",
    "",
  ].join("\n");
}

function tailwindPreset(themeName, entries) {
  const colors = {};
  const spacing = {};
  const borderRadius = {};
  const fontSize = {};
  const fontFamily = {};
  const boxShadow = {};

  for (const e of entries) {
    const [group, ...rest] = e.path;
    const key = rest.join("-");

    if (group === "color") {
      if (e.name.startsWith("color-route-")) {
        colors.route ??= {};
        colors.route[key.replace("route-", "")] = `var(${e.cssVar})`;
      } else if (e.name.startsWith("color-semantic-")) {
        colors.semantic ??= {};
        colors.semantic[key.replace("semantic-", "")] = `var(${e.cssVar})`;
      } else if (e.name.startsWith("color-brand-")) {
        colors.brand ??= {};
        colors.brand[key.replace("brand-", "")] = `var(${e.cssVar})`;
      } else if (
        !e.name.includes("color-light-") &&
        !e.name.includes("color-dark-")
      ) {
        colors[key] = `var(${e.cssVar})`;
      }
    }

    if (group === "spacing") spacing[key] = `var(${e.cssVar})`;
    if (group === "radius") borderRadius[key] = `var(${e.cssVar})`;
    if (group === "font" && e.path[1] === "size") {
      fontSize[key] = [`var(${e.cssVar})`, { lineHeight: "1.25" }];
    }
    if (group === "font" && e.path[1] === "family") {
      fontFamily[key] = [`var(${e.cssVar})`, { lineHeight: "1.5" }];
    }
    if (group === "shadow") boxShadow[key] = `var(${e.cssVar})`;
  }

  colors.background = "var(--color-background)";
  colors.foreground = "var(--color-foreground)";
  colors.card = "var(--color-card)";
  colors.border = "var(--color-border)";
  colors.ring = "var(--color-ring)";
  colors.primary = "var(--color-brand-primary)";
  colors.destructive = "var(--color-semantic-destructive)";

  const content = `/** @type {import('tailwindcss').Config} */
/** Transit theme preset — import in tailwind.config */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6).replace(/"([^"]+)":/g, "$1:")},
      spacing: ${JSON.stringify(spacing, null, 6).replace(/"([^"]+)":/g, "$1:")},
      borderRadius: ${JSON.stringify(borderRadius, null, 6).replace(/"([^"]+)":/g, "$1:")},
      fontSize: ${JSON.stringify(fontSize, null, 6).replace(/"([^"]+)":/g, "$1:")},
      fontFamily: ${JSON.stringify(fontFamily, null, 6).replace(/"([^"]+)":/g, "$1:")},
      boxShadow: ${JSON.stringify(boxShadow, null, 6).replace(/"([^"]+)":/g, "$1:")},
    },
  },
};
`;

  return content;
}

function buildTheme(themeName) {
  const base = readJson(join(root, "themes", "base", "tokens.json"));
  const theme = readJson(join(root, "themes", themeName, "tokens.json"));
  const merged = deepMerge(base, theme);
  const entries = flattenTokens(merged);

  const outDir = join(root, "dist", themeName);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const css = [
    "/* Generated by @zainalhassan/design-system — do not edit */",
    `@theme ${themeName};`,
    "",
    lightDarkCss(entries),
    "",
    "/* Utility classes */",
    ".transit-eta-time {",
    "  font-family: var(--font-family-display);",
    "  font-size: var(--component-eta-card-time-size);",
    "  font-weight: var(--component-eta-card-time-weight);",
    "  line-height: var(--font-lineHeight-tight);",
    "  letter-spacing: var(--font-letterSpacing-tight);",
    "  font-variant-numeric: tabular-nums;",
    "}",
    "",
    ".transit-eta-card {",
    "  min-height: var(--component-eta-card-min-height);",
    "  padding: var(--component-eta-card-padding-y) var(--component-eta-card-padding-x);",
    "  border-radius: var(--radius-card);",
    "  background: var(--color-card);",
    "  color: var(--color-card-foreground);",
    "  box-shadow: var(--shadow-md);",
    "}",
    "",
    ".transit-btn {",
    "  display: inline-flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  height: var(--component-button-height-md);",
    "  padding: 0 var(--component-button-padding-x);",
    "  border-radius: var(--radius-button);",
    "  font-weight: var(--font-weight-semibold);",
    "  font-size: var(--font-size-base);",
    "  transition: background var(--motion-duration-normal) var(--motion-easing-standard);",
    "}",
    "",
    ".transit-btn-primary {",
    "  background: var(--color-brand-primary);",
    "  color: var(--color-brand-primary-foreground);",
    "}",
    "",
    ".transit-btn-primary:hover {",
    "  background: var(--color-brand-primary-hover);",
    "}",
    "",
  ].join("\n");

  writeFileSync(join(outDir, "variables.css"), css);
  writeFileSync(join(outDir, "tokens.json"), JSON.stringify(merged, null, 2));
  writeFileSync(join(outDir, "tailwind.preset.js"), tailwindPreset(themeName, entries));

  console.log(`Built theme "${themeName}" → dist/${themeName}/`);
}

buildTheme("transit");
