import React from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { ToggleButton } from "react-bootstrap";
import { ToggleButtonGroup } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { findSaddlePoints as findSaddlePointsBorel } from "./lib/borelishSaddlePointFinder";
import { findSaddlePoints as findSaddlePointsVonNeumann } from "./lib/vonNeumannSaddlePointFinder";

class HandForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: 1,
      anteValue: 1,
      betValue: 2,
      numCards: 7,
      results: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setRadioValue = this.setRadioValue.bind(this);
    this.setAnteValue = this.setAnteValue.bind(this);
    this.setBetValue = this.setBetValue.bind(this);
    this.setNumCards = this.setNumCards.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Choose the appropriate algorithm based on the radio button selection
    // algorithm: 1 = von Neumann, 2 = Borel
    const findSaddlePoints =
      this.state.algorithm === 1
        ? findSaddlePointsVonNeumann
        : findSaddlePointsBorel;

    // Call findSaddlePoints with the current state values
    const saddlePoints = findSaddlePoints(
      this.state.anteValue,
      this.state.betValue,
      this.state.numCards,
    );

    // Transform the results to match the table format
    const formattedResults = saddlePoints.map((point) => ({
      p1: point["%PURE1%"],
      p2: point["%PURE2%"],
      p1payoff: point["%VALUE%"],
    }));

    // Update the state with the new results
    this.setState({ results: formattedResults });
  }

  setRadioValue(value) {
    this.setState({ algorithm: value });
  }

  setAnteValue(event) {
    this.setState({ anteValue: event.target.value });
  }

  setBetValue(event) {
    this.setState({ betValue: event.target.value });
  }

  setNumCards(event) {
    this.setState({ numCards: event.target.value });
  }

  render() {
    return (
      <section className="solver-grid" aria-label="Solver controls and results">
        <section id="options" className="surface-card">
          <header className="section-header">
            <h2 className="section-title">Game Setup</h2>
            <p className="section-subtitle">
              Configure the game and run the solver to generate optimal
              strategies.
            </p>
          </header>
          <Form onSubmit={this.handleSubmit} className="solver-form">
            <Form.Group className="form-field">
              <Form.Label as="span" className="field-label">
                Algorithm
              </Form.Label>
              <ToggleButtonGroup
                className="algorithm-toggle"
                name="games"
                type="radio"
                value={this.state.algorithm}
                onChange={this.setRadioValue}
              >
                <ToggleButton
                  id="tbg-radio-1"
                  value={1}
                  variant="outline-success"
                >
                  von Neumann
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-2"
                  value={2}
                  variant="outline-secondary"
                >
                  Borel (Currently Unavailable)
                </ToggleButton>
              </ToggleButtonGroup>
            </Form.Group>

            <Form.Group className="form-field" controlId="handform.Ante">
              <Form.Label className="field-label">Ante Value</Form.Label>
              <Form.Control
                className="number-input"
                type="number"
                min="1"
                value={this.state.anteValue}
                onChange={this.setAnteValue}
              />
            </Form.Group>

            <Form.Group className="form-field" controlId="handform.Bet">
              <Form.Label className="field-label">Bet Value</Form.Label>
              <Form.Control
                className="number-input"
                type="number"
                min="1"
                value={this.state.betValue}
                onChange={this.setBetValue}
              />
            </Form.Group>

            <Form.Group className="form-field" controlId="handform.Deck">
              <Form.Label className="field-label">
                Number of Cards in Deck
              </Form.Label>
              <Form.Control
                className="number-input"
                type="number"
                min="1"
                value={this.state.numCards}
                onChange={this.setNumCards}
              />
            </Form.Group>

            <Button className="solve-button" type="submit">
              Run Solver
            </Button>
          </Form>
        </section>

        <section id="results" className="surface-card">
          <header className="section-header">
            <h2 className="section-title">Results</h2>
            <p className="section-subtitle">
              Strategy profiles and expected payoff from the selected setup.
            </p>
          </header>

          <Table className="results-table" responsive>
            <thead>
              <tr>
                <th>Player 1 - Strategy</th>
                <th>Player 2 - Strategy</th>
                <th>Player 1 - Payoff</th>
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
        </section>
      </section>
    );
  }
}

export default HandForm;
