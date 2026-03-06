import "./App.css";
import Handform from "./HandForm";

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to solver controls
      </a>
      <main id="main-content" className="app-main" role="main">
        <section className="hero-card reveal-in">
          <h1 className="hero-title">Simplified Poker Game Solver</h1>
          <p className="hero-copy">
            Mathematics has been fascinated by poker. While games like Texas
            hold&apos;em and 7 Card Stud are fun, this project focuses on a
            simplified model where optimal play strategies can be computed and
            inspected directly.
          </p>
          <p className="hero-note">
            Given an ante/check value, a bet value, and the number of cards in a
            simplified poker game, the solver returns optimal mixed strategies
            and the associated expected payoff.
          </p>
        </section>
        <Handform />
      </main>
    </div>
  );
}

export default App;
