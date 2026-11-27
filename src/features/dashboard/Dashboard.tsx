import type { Bundesland } from '../../types/question';
import { generalQuestions } from '../../data/question-bank';
import { getStateQuestions, hasCompleteStateBank } from '../../data/bundeslaender';

interface DashboardProps {
  selectedState: Bundesland;
}

export default function Dashboard({ selectedState }: DashboardProps) {
  const stateQuestions = getStateQuestions(selectedState.code);
  const stateBankReady = hasCompleteStateBank(selectedState.code);

  return (
    <div className="dashboard">
      <section className="welcome">
        <p className="eyebrow">YOUR EXAM PREPARATION SPACE</p>
        <h1>Learn a little.<br /><span>Feel more prepared.</span></h1>
        <p className="intro">
          Practise the Leben in Deutschland questions, track your progress and get ready for exam day.
        </p>
        <div className="selected-state-card">
          <div>
            <p className="selected-state-label">YOUR SELECTED BUNDESLAND</p>
            <p className="selected-state-name">{selectedState.name}</p>
          </div>
          <span className="selected-state-count">{stateBankReady ? '10 / 10' : 'In preparation'}</span>
        </div>
        <div className={stateBankReady ? 'setup-card' : 'setup-card setup-card-warning'}>
          <div className="setup-icon" aria-hidden="true">{stateBankReady ? '✓' : 'i'}</div>
          <div>
            <p className="setup-title">{stateBankReady ? 'Your state question set is ready' : 'Your state question set is being prepared'}</p>
            <p className="setup-copy">
              {stateBankReady
                ? `All 10 ${selectedState.name} questions are available.`
                : `The ${selectedState.name} question bank has not been transcribed and verified yet. The 300 general questions are preserved and ready for the next practice milestone.`}
            </p>
          </div>
        </div>
      </section>
      <section className="stats-strip" aria-label="Question catalogue">
        <div><strong>{generalQuestions.length}</strong><span>General questions</span></div>
        <div><strong>{stateQuestions.length} / 10</strong><span>{selectedState.name} questions</span></div>
        <div><strong>16</strong><span>Bundesländer registered</span></div>
      </section>
      <section className="overview-grid" aria-label="Learning tools">
        <article className="overview-card">
          <span className="card-number">01</span>
          <h2>Learn</h2>
          <p>Work through the official question catalogue with translations and explanations.</p>
        </article>
        <article className="overview-card">
          <span className="card-number">02</span>
          <h2>Practise</h2>
          <p>Revise difficult questions and keep track of your learning progress.</p>
        </article>
        <article className="overview-card">
          <span className="card-number">03</span>
          <h2>Mock exam</h2>
          <p>Prepare with a timed test in the real exam format.</p>
        </article>
      </section>
    </div>
  );
}
