import { render, screen } from "@testing-library/react";
import App from "./App";

test("Simplified Poker Game Solver", () => {
  render(<App />);
  const linkElement = screen.getByText(/Simplified Poker Game Solver/i);
  expect(linkElement).toBeInTheDocument();
});
