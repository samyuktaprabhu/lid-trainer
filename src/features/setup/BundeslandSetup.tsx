import type { BundeslandCode } from '../../types/question';
import { bundeslaender } from '../../data/bundeslaender';

interface BundeslandSetupProps {
  value: BundeslandCode | '';
  onChange: (code: BundeslandCode) => void;
  isFirstVisit?: boolean;
}

export default function BundeslandSetup({
  value,
  onChange,
  isFirstVisit = false,
}: BundeslandSetupProps) {
  return (
    <section className={isFirstVisit ? 'state-setup state-setup-first' : 'state-setup'} aria-labelledby="state-setup-title">
      <div>
        <p className="eyebrow">{isFirstVisit ? 'LET’S GET YOU SET UP' : 'YOUR SETTINGS'}</p>
        <h1 id="state-setup-title">{isFirstVisit ? 'Which Bundesland are you preparing for?' : 'Your Bundesland'}</h1>
        <p className="state-setup-copy">
          {isFirstVisit
            ? 'The Leben in Deutschland test includes 3 questions about the federal state where you live. Choose your state to personalise your question set.'
            : 'You can change your federal state at any time. Your saved choice stays on this device.'}
        </p>
      </div>
      <label className="state-select-label" htmlFor="bundesland-select">Federal state (Bundesland)</label>
      <select
        id="bundesland-select"
        className="state-select"
        value={value}
        onChange={(event) => onChange(event.target.value as BundeslandCode)}
      >
        <option value="" disabled>Select your Bundesland</option>
        {bundeslaender.map((state) => (
          <option key={state.code} value={state.code}>{state.name} · {state.nameEn}</option>
        ))}
      </select>
      {isFirstVisit && <p className="state-setup-note">Your selection is saved locally in this browser. You can change it later.</p>}
    </section>
  );
}
