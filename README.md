# @zainalhassan/design-system

Stack-agnostic design tokens and themes for your projects. Pick a theme, import CSS variables and a Tailwind preset — implement components in whatever stack you use.

## Themes

| Theme | Description |
|-------|-------------|
| **transit** | [Transit 6.0](https://blog.transitapp.com/six-o/)-inspired — bold route colours, bubbly ETA cards, neon dark mode |

> **Note:** The Transit theme is *inspired by* Transit 6.0 aesthetics. It is not official Transit brand assets. Typography uses [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) as an open substitute for proprietary Puffin Transit.

## Quick start

```bash
git clone https://github.com/zainalhassan/design-system.git
cd design-system
npm run build
npm run preview   # open http://localhost:3456
```

## Use in a project

### Option A — npm link (local development)

```bash
# In design-system/
npm link

# In your app/
npm link @zainalhassan/design-system
```

### Option B — file dependency

```json
{
  "dependencies": {
    "@zainalhassan/design-system": "file:../design-system"
  }
}
```

### Option C — GitHub dependency

```json
{
  "dependencies": {
    "@zainalhassan/design-system": "github:zainalhassan/design-system"
  }
}
```

## Next.js + Tailwind

```css
/* app/globals.css */
@import "@zainalhassan/design-system/transit/variables.css";

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
```

```js
// tailwind.config.ts
import transit from "@zainalhassan/design-system/transit/tailwind";

export default {
  presets: [transit],
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
};
```

Enable dark mode:

```tsx
// layout.tsx
<html lang="en" className="dark">  {/* or toggle via JS */}
```

## Laravel / plain HTML

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/vendor/design-system/dist/transit/variables.css">

<button class="transit-btn transit-btn-primary">Plan trip</button>
<div class="transit-eta-card">...</div>
```

## Repo structure

```
design-system/
├── themes/
│   ├── base/tokens.json      # shared spacing, radii, type scale
│   └── transit/tokens.json   # Transit 6.0-inspired colours & components
├── specs/
│   └── transit.md            # component spec (ETA cards, buttons, etc.)
├── scripts/build.mjs         # generates dist/
├── dist/transit/
│   ├── variables.css         # CSS custom properties + utility classes
│   ├── tailwind.preset.js    # Tailwind theme extension
│   └── tokens.json           # merged token output
└── preview/index.html        # visual preview
```

## Adding another theme

1. Create `themes/your-theme/tokens.json` (extends base)
2. Add `buildTheme("your-theme")` in `scripts/build.mjs`
3. Run `npm run build`
4. Add a spec in `specs/your-theme.md`

## Design tokens

Tokens follow the [Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) format. Edit JSON in `themes/`, never edit `dist/` directly.

Key Transit tokens:

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-brand-primary` | `#1BD974` | Signature green |
| `--component-eta-card-time-size` | `60px` | Supersized departure time |
| `--radius-card` | `20px` | Bubbly ETA card corners |
| `--color-dark-background` | `#0A0E17` | Neon dark mode base |

See [specs/transit.md](./specs/transit.md) for component guidelines.

## License

MIT — theme inspired by Transit 6.0; Transit is a trademark of Transit App, Inc.
