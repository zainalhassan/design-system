# Transit theme — component spec

Inspired by [Transit 6.0](https://blog.transitapp.com/six-o/) design language. This is an **independent theme** — not official Transit brand assets. Use it as a visual template for your projects.

## Design principles

1. **Bigger, bolder, rounder** — generous radii, large type, confident whitespace
2. **ETAs front and center** — the most important data is the largest element on screen
3. **Route colours as identity** — saturated line colours on cards, chips, and headers
4. **Neon dark mode** — midnight blue backgrounds, not flat grey; accents glow subtly
5. **Skimmable hierarchy** — one primary action per view; secondary info tucked inside cards

## Typography

| Role | Token | Usage |
|------|-------|-------|
| UI body | `--font-family-sans` | Labels, paragraphs, nav |
| Display / ETA | `--font-family-display` + `.transit-eta-time` | Departure times, hero numbers |
| Weights | 400 / 500 / 600 / **700–800** for ETAs | Bold by default for key info |

Load **Plus Jakarta Sans** (Puffin Transit substitute):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

## Components

### ETA card

The signature Transit 6.0 pattern — selectable departure cards with route colour header.

```
┌─────────────────────────────┐
│ ████ Route 42 · Downtown    │  ← route colour bar (--color-route-*)
│                             │
│         12                  │  ← .transit-eta-time (60px, extrabold)
│         min                 │
│  🔔 Alert · ♿ Accessible    │  ← metadata row, muted
└─────────────────────────────┘
```

| Property | Token |
|----------|-------|
| Min height | `--component-eta-card-min-height` |
| Radius | `--radius-card` (20px) |
| Time size | `--component-eta-card-time-size` |
| Padding | `--component-eta-card-padding-*` |

**States:** default, selected (ring: `--color-ring`), disabled (opacity 0.5)

**Stack mapping:**

| Spec | React/shadcn | Laravel Blade |
|------|--------------|---------------|
| Card shell | `<Card className="transit-eta-card">` | `<div class="transit-eta-card">` |
| Route header | Coloured `div` with `background: var(--color-route-blue)` | Same |
| Time | `<span class="transit-eta-time">` | Same |

### Button

Rounded, medium height, semibold label.

| Variant | Background | Text |
|---------|------------|------|
| Primary | `--color-brand-primary` | `--color-brand-primary-foreground` |
| Secondary | `--color-brand-secondary` | `--color-brand-secondary-foreground` |
| Ghost | transparent | `--color-foreground` |

Classes: `.transit-btn` + `.transit-btn-primary`

### Route chip

Pill badge using route palette.

```css
.route-chip {
  background: var(--color-route-blue);
  color: white;
  border-radius: var(--radius-chip);
  padding: var(--spacing-1) var(--spacing-3);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}
```

### Alert banner

Use official Transit partner semantic colours:

| Level | Token |
|-------|-------|
| Warning | `--color-semantic-warning` (#FFA900) |
| Emergency | `--color-semantic-destructive` (#E51304) |

## Dark mode

Add class `dark` to `<html>` or `data-theme="dark"` on root. Semantic aliases (`--color-background`, etc.) swap automatically.

Optional neon glow on focus/selected cards in dark mode:

```css
.dark .transit-eta-card.is-selected {
  box-shadow: var(--color-dark-neon-glow);
}
```

## Route colour palette

Use for transit lines, categories, or any categorical data:

`--color-route-red` · `--color-route-orange` · `--color-route-yellow` · `--color-route-green` · `--color-route-teal` · `--color-route-blue` · `--color-route-indigo` · `--color-route-purple` · `--color-route-pink` · `--color-route-gray`

## References

- [Transit 6.0 blog post](https://blog.transitapp.com/six-o/)
- [Transit 6.0 quick start](https://help.transitapp.com/article/546-transit-6-0-quick-start-guide)
