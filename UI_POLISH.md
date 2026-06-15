# UI Polish - Design Engineering (Emil Kowalski Philosophy)

> Basierend auf Emil Kowalski's Design Engineering Prinzipien
> Siehe auch: [animations.dev](https://animations.dev/)

## Core Philosophy

### Taste is trained, not innate
Gutes Design ist keine persönliche Präferenz – es ist ein trainiertes Instinkt. Die Fähigkeit über das Offensichtliche hinaus zu sehen und zu erkennen, was etwas verbessert.

### Unseen details compound
Die meisten Details bemerken Benutzer nie bewusst. Das ist der Punkt. Wenn ein Feature genau so funktioniert, wie jemand es erwartet, gehen sie weiter ohne einen zweiten Gedanken. Das ist das Ziel.

> "All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune." - Paul Graham

### Beauty is leverage
Menschen wählen Tools basierend auf dem Gesamterlebnis, nicht nur Funktionalität. Gute Defaults und gute Animationen sind echte Differenziatoren. Schönheit wird in Software unterschätzt.

---

## Implementierte Polish-Änderungen

### Timing Functions (Custom Easing)

| Vorher | Nachher | Warum |
|--------|---------|-------|
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Spezifische Properties statt `all` |
| `ease-in` | `ease-out` mit custom curve | `ease-in` fühlt sich träge an; `ease-out` gibt instant Feedback |

**Custom Curves:**
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Schnelles Feedback */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Bouncy feel */
```

### Durations

| Context | Duration | Warum |
|---------|----------|-------|
| Instant (active state) | 100ms | Muss sich sofort anfühlen |
| Fast (hover) | 150ms | Schnell aber merkbar |
| Normal (standard) | 200ms | Angenehmer Standard |
| Slow (page transitions) | 300ms | Ehrfürchtig aber nicht träge |

### Button States

| State | Transform | Box Shadow | Duration |
|-------|-----------|------------|----------|
| Default | - | - | - |
| Hover | `translateY(-1px)` | Soft shadow | 150ms |
| Active | `scale(0.97)` | Slightly stronger | 100ms |
| Disabled | - | None | - |

### Card Interactions

```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(27, 77, 92, 0.1);
}
```

### Link Underline Animation

```css
.link-hover::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 200ms cubic-bezier(0, 0, 0.2, 1);
}

.link-hover:hover::after {
  width: 100%;
}
```

### Staggered Animations

Für Listen und Grids mit gestaffeltem Erscheinen:

```css
.fade-in-stagger > * {
  animation: fadeInUp 400ms cubic-bezier(0, 0, 0.2, 1) forwards;
  opacity: 0;
}

.fade-in-stagger > *:nth-child(1) { animation-delay: 0ms; }
.fade-in-stagger > *:nth-child(2) { animation-delay: 50ms; }
.fade-in-stagger > *:nth-child(3) { animation-delay: 100ms; }
.fade-in-stagger > *:nth-child(4) { animation-delay: 150ms; }
.fade-in-stagger > *:nth-child(5) { animation-delay: 200ms; }
.fade-in-stagger > *:nth-child(6) { animation-delay: 250ms; }
```

### Modal/Overlay Animation

```css
.modal-overlay {
  animation: fadeIn 200ms ease-out forwards;
}

.modal-content {
  animation: scaleInSpring 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

### Badge Pop Animation

```css
.badge-pop {
  animation: badgePop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes badgePop {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
```

### Avatar Hover

```css
.avatar-hover {
  transition-property: transform, box-shadow;
  transition-duration: 200ms;
}

.avatar-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(27, 77, 92, 0.15);
}
```

### Skeleton Loading Shimmer

```css
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(27, 77, 92, 0.06) 25%,
    rgba(27, 77, 92, 0.12) 50%,
    rgba(27, 77, 92, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### Focus States

Immer sichtbares Feedback für Tastatur-Navigation:

```css
.focus-visible-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(27, 77, 92, 0.2);
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Key Principles (Emil Kowalski)

1. **Specify exact properties** — Vermeide `all` in transitions
2. **Nothing appears from nothing** — Dinge sollten nicht einfach erscheinen (verwende fade/scale)
3. **ease-out over ease-in** — `ease-in` fühlt sich träge an; `ease-out` gibt instant feedback
4. **Buttons must feel responsive** — `:active` state mit `scale(0.97)`
5. **Popovers scale from trigger** — `transform-origin: var(--radix-popover-content-transform-origin)`
6. **Micro-interactions matter** — Hover, active, focus states für alle interaktiven Elemente
7. **Stagger for delight** — Gestaffelte Animationen in Listen machen UI lebendiger
8. **Beauty compounds** — Tausend kleine unsichtbare Details ergeben zusammen etwas Grossartiges

---

## Referenzen

- [Emil Kowalski's Design Engineering](https://emilkowalski.ski/)
- [Animations Course](https://animations.dev/)
- [UI Animation Newsletter](https://uianimation.news/)