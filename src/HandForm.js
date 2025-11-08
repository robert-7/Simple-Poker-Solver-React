import React from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { ToggleButton } from "react-bootstrap";
import { ToggleButtonGroup } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { findSaddlePoints as findSaddlePointsBorel } from "./lib/borelishSaddlePointFinder";
import { findSaddlePoints as findSaddlePointsPSP } from "./lib/pspSaddlePointFinder";

class HandForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: 1,
      anteValue: 0,
      betValue: 0,
      numCards: 0,
      results: [
        {
          key: "unique row key",
          p1: "an",
          p2: "example",
          p1payoff: "row",
        },
      ],
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
    // algorithm: 1 = Borel, 2 = von Neumann (PSP)
    const findSaddlePoints = this.state.algorithm === 1
      ? findSaddlePointsBorel
      : findSaddlePointsPSP;

    // Call findSaddlePoints with the current state values
    const saddlePoints = findSaddlePoints(
      this.state.anteValue,
      this.state.betValue,
      this.state.numCards
    );

    // Transform the results to match the table format
    const formattedResults = saddlePoints.map((point) => ({
      p1: point["%PURE1%"],
      p2: point["%PURE2%"],
      p1payoff: point["%VALUE%"]
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
      <section>
        <section id="options" className="p-3">
          <header>
            <h2>Game</h2>
          </header>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="handform.Type">
              <Form.Label>Game Type:</Form.Label>
              <br />
              <ToggleButtonGroup
                name="games"
                type="radio"
                value={this.state.algorithm}
                onChange={this.setRadioValue}
              >
                <ToggleButton id="tbg-radio-1" value={1}>
                  Borel
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2}>
                  von Neumann
                </ToggleButton>
              </ToggleButtonGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="handform.Ante">
              <Form.Label>Ante Value:</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                onChange={this.setAnteValue}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="handform.Bet">
              <Form.Label>Bet Value:</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                onChange={this.setBetValue}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="handform.Deck">
              <Form.Label>Number of Cards In Deck:</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                onChange={this.setNumCards}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </section>

        <section id="results" className="p-3">
          <header>
            <h2 className="pb-2">Results</h2>
          </header>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Player 1 - Strategy</th>
                <th>Player 2 - Strategy</th>
                <th>Player 1 - Payoff</th>
              </tr>
            </thead>
            <tbody>
              {this.state.results.map((r, index) => (
                <tr key={index}>
                  <td>{r.p1}</td>
                  <td>{r.p2}</td>
                  <td>{r.p1payoff}</td>
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
