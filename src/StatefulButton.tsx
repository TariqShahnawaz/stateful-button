import { useState, useRef, useEffect } from 'react';
import './StatefulButton.css';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface StatefulButtonProps {
  onAction: () => Promise<boolean>;
  idleLabel: string;
  loadingLabel: string;
  successLabel: string;
  errorLabel: string;
  variant?: 'primary' | 'secondary';
}

export function StatefulButton({
  onAction,
  idleLabel,
  loadingLabel,
  successLabel,
  errorLabel,
  variant = 'primary',
}: StatefulButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const [shake, setShake] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, []);

  const handleClick = async () => {
    if (state === 'loading') return;

    if (successTimer.current) {
      clearTimeout(successTimer.current);
      successTimer.current = null;
    }
    if (shakeTimer.current) {
      clearTimeout(shakeTimer.current);
      shakeTimer.current = null;
    }

    const currentId = ++requestId.current;
    setState('loading');
    setShake(false);

    try {
      const ok = await onAction();
      if (currentId !== requestId.current) return;

      if (ok) {
        setState('success');
        successTimer.current = setTimeout(() => {
          if (currentId === requestId.current) setState('idle');
          successTimer.current = null;
        }, 2000);
      } else {
        setState('error');
        setShake(true);
        shakeTimer.current = setTimeout(() => {
          setShake(false);
          shakeTimer.current = null;
        }, 500);
      }
    } catch {
      if (currentId !== requestId.current) return;
      setState('error');
      setShake(true);
      shakeTimer.current = setTimeout(() => {
        setShake(false);
        shakeTimer.current = null;
      }, 500);
    }
  };

  return (
    <button
      type="button"
      className={`sfb sfb--${variant} sfb--${state}${shake ? ' sfb--shake' : ''}`}
      onClick={handleClick}
      disabled={state === 'loading'}
      aria-busy={state === 'loading'}
    >
      <span className="sfb__content">
        <span className="sfb__panel sfb__panel--idle" aria-hidden={state !== 'idle'}>
          {idleLabel}
        </span>
        <span className="sfb__panel sfb__panel--loading" aria-hidden={state !== 'loading'}>
          <span className="sfb__spinner" />
          {loadingLabel}
        </span>
        <span className="sfb__panel sfb__panel--success" aria-hidden={state !== 'success'}>
          <svg className="sfb__check" viewBox="0 0 24 24" fill="none">
            <path
              className="sfb__check-path"
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {successLabel}
        </span>
        <span className="sfb__panel sfb__panel--error" aria-hidden={state !== 'error'}>
          <svg className="sfb__alert" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
            <path d="M12 7v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
          </svg>
          {errorLabel}
        </span>
      </span>
    </button>
  );
}
