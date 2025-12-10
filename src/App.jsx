import "./App.css";
import Handform from "./HandForm";

function App() {
  return (
    <div className="App">
      <article className="container">
        <header className="p-3 pb-md-4 mx-auto text-center">
          <h1 className="display-4 fw-normal">Simplified Poker Game Solver</h1>
          <p className="fs-5 text-muted">
            <br />
            Mathematics has been fascinated by poker. While a game of Texas hold
            'em or 7 Card Stud are fun, mathematics has chosen to focus on
            simpler games and has discovered several optimal play strategies.
          </p>
        </header>
        <section>
          <p>
            Given an ante/check value, a bet value, and the number of cards in a
            Simplified Poker Game, this program will give the optimal strategies
            for that game.
          </p>
        </section>
        <Handform />
      </article>
    </div>
  );
}

export default App;
