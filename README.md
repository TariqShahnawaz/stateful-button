# Stateful Button — Intentional Motion

A button component that choreographs state transitions (idle → hover → loading → success/error → idle) so the user always knows what's happening, without a single abrupt swap.

## States

| State | Visual treatment |
|-------|-----------------|
| Idle | Default background, label centered |
| Hover / Focus | Subtle lift (`translateY(-2px)`), brighter background, focus ring via `:focus-visible` |
| Loading | Spinner + "Sending…" label, button disabled, deeper background |
| Success | Green background, animated checkmark draw, auto-returns to idle after 2s |
| Error | Red background, single shake (skipped under reduced-motion), retry label — stays until clicked |

## Key design decisions

- **250ms ease-out-quart** for all state transitions — fast enough to feel responsive, slow enough to register.
- **80ms cross-fade delay** — outgoing label exits before incoming label enters.
- **Compositor-friendly only**: `transform` and `opacity` drive all motion. No width or layout animations.
- **Interruptible**: a request-id guard ignores stale async results; timers are cleared on re-click; the button is disabled during loading.
- **prefers-reduced-motion**: all transforms, shake, spinner rotation, and checkmark draw are removed. Opacity transitions (150ms) and color changes remain so state is still communicated.
- **Keyboard accessible**: `:focus-visible` ring, `aria-busy` during loading, `aria-hidden` on inactive label panels.
