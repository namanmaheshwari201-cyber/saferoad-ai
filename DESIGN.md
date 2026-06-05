# RoadGuardian AI — Design Brief

## Direction

RoadGuardian AI — Deep dark professional government-grade emergency response and road transparency platform for India, commanding trust through unflinching clarity.

## Tone

Utilitarian-refined command dashboard: authoritative, accessible, data-dense. Government-grade clarity without corporate gloss — civilian and official users both depend on it.

## Differentiation

Deep navy interface with amber, emerald, and red accents create instant visual hierarchy and authority. Every element serves information transmission, zero decoration, WCAG 2.1 AA contrast throughout.

## Color Palette

| Token | OKLCH | Role |
|-------|-------|------|
| Background | `0.08 0.022 260` | Deep navy canvas (#0a0f1e equiv) |
| Foreground | `0.96 0.002 240` | High-contrast white text (#f1f5f9 equiv) |
| Card | `0.11 0.025 255` | Slightly elevated surfaces (#0f172a equiv) |
| Primary | `0.45 0.18 260` | Cool blue CTAs, headers, links |
| Accent | `0.65 0.18 65` | Amber alerts and warning states |
| Success | `0.62 0.19 155` | Emerald for completed/resolved status |
| Destructive | `0.55 0.22 20` | Red critical warnings, danger zones |
| Muted | `0.2 0.025 255` | Disabled, secondary, low-priority UI |
| Border | `0.18 0.02 260` | Subtle structure lines |

## Typography

- Display: Space Grotesk (600–700 weight) — hero text, navigation, section headings, government authority
- Body: Inter (400–500 weight) — accessible body text, UI labels, data tables, line-height 1.5
- Mono: Fira Code — code blocks, ticket numbers, structured data
- Scale: Hero `text-4xl font-bold`, H2 `text-2xl font-bold`, Label `text-sm font-semibold`, Body `text-base`

## Elevation & Depth

Minimal shadow hierarchy: cards on deep background with 1px borders and subtle shadows only on hover. No glassmorphism, no decorative depth — structure via borders and subtle color shifts, clarity paramount.

## Structural Zones

| Zone | Background | Border | Notes |
|------|-----------|--------|-------|
| Header | `bg-card` with subtle shadow | `border-b border-border` | Sticky, clear branding, navigation |
| Sidebar | `bg-card` | Right border subtle | Collapsible, compact icons, text labels |
| Main | `bg-background` | None | Clean deep navy canvas |
| Content cards | `bg-card` | 1px border-border | White-level contrast, hover lift |
| Footer | `bg-muted/10` | `border-t border-border` | Minimal, no branding |

## Spacing & Rhythm

4px grid baseline. Section gaps 24–32px. Content padding 16–24px. Data table rows 12–16px. Mobile: 16–20px gaps, maintained readability 320px+. Density: compact for data, spacious for focus areas.

## Component Patterns

- Buttons: Primary cool-blue on deep background with white text, no shadow. Secondary outline. Danger/warning color-coded. Hover: +4% L lightness. Touch targets 44×44px minimum.
- Cards: `bg-card` with 1px border, no shadow at rest, subtle shadow on hover. Rounded 12px. Header accent stripe in muted or primary color for hierarchy.
- Badges: Pill-shaped, color-coded status — amber for warning/alert, emerald for success, red for critical, blue for default.
- Data tables: Bordered, striped rows (alternating `bg-muted/5`), sticky header, compact 12px padding, monospace numbers.

## Motion

- Entrance: Fade-in 200ms ease-out on content load
- Hover: 100ms color/border shift, no transform (stability for data ui)
- Alert/Error: Shake 150ms (attention without animation noise)
- Decorative: Minimal — focus on function

## Constraints

- No full-page gradients or ambient effects
- No glow, neon, or bouncy animations — command-dashboard clarity
- WCAG 2.1 AA+ contrast (4.5:1 minimum foreground/background)
- Mobile-first responsive 320px minimum, fluid up to 2xl
- Color meaningful only when paired with icon/text (no color-only meaning)
- Typography weights strictly 400–700 (no 300, no 800+)

## Signature Detail

Deep navy background + high-contrast amber/emerald/red accents + data-dense card layout + strong typography hierarchy = unflinching authority civilians and officials both trust without question.
