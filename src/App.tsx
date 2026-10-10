import { useState } from 'react';
import { StatefulButton } from './StatefulButton';
import './App.css';

type DemoMode = 'random' | 'success' | 'error';

export default function App() {
  const [mode, setMode] = useState<DemoMode>('random');

  const handleAction = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const delay = 800 + Math.random() * 1200;
      setTimeout(() => {
        if (mode === 'success') resolve(true);
        else if (mode === 'error') resolve(false);
        else resolve(Math.random() >= 0.2);
      }, delay);
    });
  };

  return (
    <div className="demo">
      <div className="demo__card">
        <h1>Intentional Motion Button</h1>
        <p className="demo__subtitle">
          A button that communicates state through choreographed transitions —
          no abrupt swaps. Try spam-clicking, tabbing with the keyboard, or
          switching modes below.
        </p>

        <div className="demo__mode-group" role="radiogroup" aria-label="Demo mode">
          <button
            type="button"
            className={`demo__mode${mode === 'random' ? ' is-active' : ''}`}
            onClick={() => setMode('random')}
            role="radio"
            aria-checked={mode === 'random'}
          >
            Random (20% fail)
          </button>
          <button
            type="button"
            className={`demo__mode${mode === 'success' ? ' is-active' : ''}`}
            onClick={() => setMode('success')}
            role="radio"
            aria-checked={mode === 'success'}
          >
            Force Success
          </button>
          <button
            type="button"
            className={`demo__mode${mode === 'error' ? ' is-active' : ''}`}
            onClick={() => setMode('error')}
            role="radio"
            aria-checked={mode === 'error'}
          >
            Force Error
          </button>
        </div>

        <div className="demo__buttons">
          <StatefulButton
            onAction={handleAction}
            idleLabel="Send Message"
            loadingLabel="Sending…"
            successLabel="Sent!"
            errorLabel="Failed — Retry?"
          />
          <StatefulButton
            onAction={handleAction}
            idleLabel="Save Changes"
            loadingLabel="Saving…"
            successLabel="Saved!"
            errorLabel="Error — Retry?"
            variant="secondary"
          />
        </div>

        <p className="demo__hints">
          Click repeatedly to test interruptibility. Tab to the button to see
          the focus ring. Toggle your OS reduced-motion setting to see
          accessible fallbacks.
        </p>
      </div>

      <div className="demo__notes">
        <h2>Duration &amp; Easing Rationale</h2>
        <ul>
          <li>
            <strong>250ms</strong> for state transitions — fast enough to feel
            responsive, slow enough to register visually. Below 200ms feels
            abrupt; above 350ms feels sluggish.
          </li>
          <li>
            <strong>cubic-bezier(0.22, 1, 0.36, 1)</strong> (ease-out-quart) —
            decelerates into rest so labels settle naturally without overshoot.
          </li>
          <li>
            <strong>80ms cross-fade delay</strong> — the outgoing label begins
            exiting before the incoming label enters, preventing both from
            appearing simultaneously.
          </li>
          <li>
            <strong>450ms shake</strong> with a sharp easing — communicates
            error through a physical metaphor without being annoying.
          </li>
          <li>
            <strong>700ms linear spinner</strong> — constant rotation reads as
            ongoing work, not a transition.
          </li>
          <li>
            <strong>350ms checkmark draw</strong> with 100ms delay — the draw
            begins after the success background settles, creating a satisfying
            confirmation beat.
          </li>
          <li>
            Under <code>prefers-reduced-motion</code>, all transforms and
            animations are removed; opacity transitions (150ms) and color
            changes remain so state is still communicated.
          </li>
        </ul>
      </div>
    </div>
  );
}
