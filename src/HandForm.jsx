import React from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { ToggleButton } from "react-bootstrap";
import { ToggleButtonGroup } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { findSaddlePoints as findSaddlePointsVonNeumann } from "./lib/vonNeumannSaddlePointFinder";

const MAX_DECK_SIZE = 10;
const SUPPORTED_ALGORITHM = 1;

class HandForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: 1,
      anteValue: 1,
      betValue: 2,
      numCards: 7,
      results: [],
      isCalculating: false,
      calcError: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setRadioValue = this.setRadioValue.bind(this);
    this.setAnteValue = this.setAnteValue.bind(this);
    this.setBetValue = this.setBetValue.bind(this);
    this.setNumCards = this.setNumCards.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const validationErrors = this.getValidationErrors();

    if (validationErrors.algorithm) {
      this.setState({ calcError: validationErrors.algorithm });
      return;
    }

    if (Object.keys(validationErrors).length > 0 || this.state.isCalculating) {
      return;
    }

    const anteValue = Number(this.state.anteValue);
    const betValue = Number(this.state.betValue);
    const numCards = Number(this.state.numCards);

    this.setState({ isCalculating: true, calcError: "" }, () => {
      // Yield once so the loading state renders before heavy solver work.
      window.setTimeout(() => {
        try {
          const saddlePoints = findSaddlePointsVonNeumann(
            anteValue,
            betValue,
            numCards,
          );

          const formattedResults = saddlePoints.map((point) => ({
            p1: point["%PURE1%"],
            p2: point["%PURE2%"],
            p1payoff: this.formatPayoff(point["%VALUE%"]),
          }));

          this.setState({ results: formattedResults, isCalculating: false });
        } catch (error) {
          this.setState({
            calcError:
              "Calculation failed. Please verify your inputs and try again.",
            isCalculating: false,
          });
        }
      }, 0);
    });
  }

  getValidationErrors() {
    const errors = {};
    const anteValue = Number(this.state.anteValue);
    const betValue = Number(this.state.betValue);
    const numCards = Number(this.state.numCards);

    if (this.state.algorithm !== SUPPORTED_ALGORITHM) {
      errors.algorithm =
        "Borel is currently unavailable. Please use von Neumann.";
    }

    if (!Number.isFinite(anteValue) || anteValue <= 0) {
      errors.anteValue = "Ante must be greater than 0.";
    }

    if (!Number.isFinite(betValue) || betValue <= 0) {
      errors.betValue = "Bet must be greater than 0.";
    }

    if (!Number.isInteger(numCards) || numCards <= 0) {
      errors.numCards = "Deck size must be a positive whole number.";
    } else if (numCards > MAX_DECK_SIZE) {
      errors.numCards = `Deck size must be ${MAX_DECK_SIZE} or less for responsive performance.`;
    }

    return errors;
  }

  formatPayoff(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return String(value);
    }

    const truncatedValue = Math.trunc(numericValue * 1_000_000) / 1_000_000;
    return truncatedValue.toFixed(6);
  }

  setRadioValue(value) {
    if (value !== SUPPORTED_ALGORITHM) {
      this.setState({
        algorithm: SUPPORTED_ALGORITHM,
        calcError: "Borel is currently unavailable. Please use von Neumann.",
      });
      return;
    }

    this.setState({ algorithm: value, calcError: "" });
  }

  setAnteValue(event) {
    this.setState({ anteValue: event.target.value, calcError: "" });
  }

  setBetValue(event) {
    this.setState({ betValue: event.target.value, calcError: "" });
  }

  setNumCards(event) {
    this.setState({ numCards: event.target.value, calcError: "" });
  }

  render() {
    const validationErrors = this.getValidationErrors();
    const isFormValid = Object.keys(validationErrors).length === 0;
    const hasResults = this.state.results.length > 0;
    const resultSummary = hasResults
      ? `${this.state.results.length} strategy profile${this.state.results.length === 1 ? "" : "s"} generated.`
      : "No results yet.";
    const statusMessageId = "solver-status-message";

    return (
      <section className="solver-grid" aria-label="Solver controls and results">
        <section id="options" className="surface-card reveal-in">
          <header className="section-header">
            <h2 className="section-title">Game Setup</h2>
            <p className="section-subtitle">
              Configure the game and run the solver to generate optimal
              strategies.
            </p>
          </header>
          <Form onSubmit={this.handleSubmit} className="solver-form">
            <Form.Group className="form-field">
              <fieldset className="algorithm-fieldset">
                <legend className="field-label">Algorithm</legend>
                <ToggleButtonGroup
                  className="algorithm-toggle"
                  name="games"
                  type="radio"
                  value={this.state.algorithm}
                  onChange={this.setRadioValue}
                >
                  <ToggleButton
                    id="tbg-radio-1"
                    value={SUPPORTED_ALGORITHM}
                    variant="outline-success"
                    disabled={this.state.isCalculating}
                  >
                    von Neumann
                  </ToggleButton>
                  <ToggleButton
                    id="tbg-radio-2"
                    value={2}
                    variant="outline-secondary"
                    disabled={true}
                  >
                    Borel (Currently Unavailable)
                  </ToggleButton>
                </ToggleButtonGroup>
                <Form.Text className="field-hint">
                  Borel will be enabled once implementation is complete.
                </Form.Text>
              </fieldset>
            </Form.Group>

            <Form.Group className="form-field" controlId="handform.Ante">
              <Form.Label className="field-label">Ante Value</Form.Label>
              <Form.Control
                className="number-input"
                type="number"
                min="1"
                step="any"
                isInvalid={Boolean(validationErrors.anteValue)}
                value={this.state.anteValue}
                onChange={this.setAnteValue}
                disabled={this.state.isCalculating}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.anteValue}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-field" controlId="handform.Bet">
              <Form.Label className="field-label">Bet Value</Form.Label>
              <Form.Control
                className="number-input"
                type="number"
                min="1"
                step="any"
                isInvalid={Boolean(validationErrors.betValue)}
                value={this.state.betValue}
                onChange={this.setBetValue}
                disabled={this.state.isCalculating}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.betValue}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-field" controlId="handform.Deck">
              <Form.Label className="field-label">
                Number of Cards in Deck
              </Form.Label>
              <Form.Control
                className="number-input"
                type="number"
                min="1"
                max={MAX_DECK_SIZE}
                step="1"
                isInvalid={Boolean(validationErrors.numCards)}
                value={this.state.numCards}
                onChange={this.setNumCards}
                disabled={this.state.isCalculating}
                aria-describedby="deck-size-hint"
              />
              <Form.Text id="deck-size-hint" className="field-hint">
                Deck sizes above {MAX_DECK_SIZE} are blocked to keep
                calculations responsive.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {validationErrors.numCards}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              className="solve-button"
              type="submit"
              disabled={!isFormValid || this.state.isCalculating}
              aria-describedby={
                this.state.isCalculating ? statusMessageId : undefined
              }
            >
              {this.state.isCalculating ? "Calculating..." : "Run Solver"}
            </Button>

            {this.state.isCalculating && (
              <p
                id={statusMessageId}
                className="solver-status"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                Running solver, please wait...
              </p>
            )}
          </Form>
        </section>

        <section
          id="results"
          className="surface-card reveal-in"
          aria-busy={this.state.isCalculating}
        >
          <header className="section-header">
            <h2 className="section-title">Results</h2>
            <p className="section-subtitle">
              Strategy profiles and expected payoff from the selected setup.
            </p>
            <p className="results-meta" aria-live="polite" aria-atomic="true">
              {resultSummary}
            </p>
          </header>

          {this.state.calcError && (
            <p className="calc-error" role="alert">
              {this.state.calcError}
            </p>
          )}

          <div className="results-table-wrapper">
            <Table className="results-table">
              <caption className="visually-hidden">
                Computed player strategies and expected payoff.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Player 1 - Strategy</th>
                  <th scope="col">Player 2 - Strategy</th>
                  <th scope="col">Player 1 - Payoff</th>
                </tr>
              </thead>
              <tbody>
                {this.state.results.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-state-cell">
                      Run the solver to see optimal strategy outputs.
                    </td>
                  </tr>
                )}

                {this.state.results.map((r, index) => (
                  <tr key={index}>
                    <td className="strategy-cell">{r.p1}</td>
                    <td className="strategy-cell">{r.p2}</td>
                    <td className="payoff-cell">{r.p1payoff}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      </section>
    );
  }
}

export default HandForm;
