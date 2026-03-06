import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HandForm from "./HandForm";
import { findSaddlePoints } from "./lib/vonNeumannSaddlePointFinder";

vi.mock("./lib/vonNeumannSaddlePointFinder", () => ({
  findSaddlePoints: vi.fn(),
}));

describe("HandForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders defaults and keeps unavailable algorithm disabled", () => {
    render(<HandForm />);

    expect(
      screen.getByRole("heading", { name: /game setup/i }),
    ).toBeInTheDocument();

    const unavailable = screen.getByRole("radio", {
      name: /borel \(currently unavailable\)/i,
    });
    expect(unavailable).toBeDisabled();

    expect(
      screen.getByText(
        /borel will be enabled once implementation is complete/i,
      ),
    ).toBeInTheDocument();
  });

  test("runs solver and renders formatted results", async () => {
    vi.useFakeTimers();
    findSaddlePoints.mockReturnValue([
      {
        "%PURE1%": "1,0,1",
        "%PURE2%": "0,1,1",
        "%VALUE%": 0.123456789,
      },
      {
        "%PURE1%": "1,1,1",
        "%PURE2%": "0,0,1",
        "%VALUE%": "not-a-number",
      },
    ]);

    render(<HandForm />);

    fireEvent.change(screen.getByLabelText(/ante value/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/bet value/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/number of cards in deck/i), {
      target: { value: "4" },
    });

    fireEvent.click(screen.getByRole("button", { name: /run solver/i }));

    expect(
      screen.getByRole("button", { name: /calculating\.\.\./i }),
    ).toBeDisabled();

    await act(async () => {
      vi.runAllTimers();
    });

    expect(findSaddlePoints).toHaveBeenCalledWith(2, 3, 4);
    expect(screen.getByText("1,0,1")).toBeInTheDocument();
    expect(screen.getByText("0,1,1")).toBeInTheDocument();
    expect(screen.getByText("0.123456")).toBeInTheDocument();
    expect(screen.getByText("not-a-number")).toBeInTheDocument();
    expect(
      screen.getByText(/2 strategy profiles generated\./i),
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  test("shows validation messages and prevents invalid submit", () => {
    render(<HandForm />);

    fireEvent.change(screen.getByLabelText(/ante value/i), {
      target: { value: "0" },
    });
    expect(
      screen.getByText(/ante must be greater than 0\./i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/ante value/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/bet value/i), {
      target: { value: "0" },
    });
    expect(
      screen.getByText(/bet must be greater than 0\./i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/bet value/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/number of cards in deck/i), {
      target: { value: "2.5" },
    });
    expect(
      screen.getByText(/deck size must be a positive whole number\./i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/number of cards in deck/i), {
      target: { value: "11" },
    });
    expect(
      screen.getByText(
        /deck size must be 10 or less for responsive performance\./i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /run solver/i })).toBeDisabled();
    expect(findSaddlePoints).not.toHaveBeenCalled();
  });

  test("guards unsupported algorithm and surfaces error", () => {
    const ref = React.createRef();
    render(<HandForm ref={ref} />);

    act(() => {
      ref.current.setRadioValue(2);
    });

    expect(
      screen.getByText(
        /borel is currently unavailable\. please use von neumann\./i,
      ),
    ).toBeInTheDocument();

    // Directly set unsupported algorithm to cover submit-time validation guard.
    act(() => {
      ref.current.setState({ algorithm: 2 });
    });

    fireEvent.click(screen.getByRole("button", { name: /run solver/i }));

    expect(findSaddlePoints).not.toHaveBeenCalled();
  });

  test("shows fallback error when solver throws", async () => {
    vi.useFakeTimers();
    findSaddlePoints.mockImplementation(() => {
      throw new Error("boom");
    });

    render(<HandForm />);
    fireEvent.click(screen.getByRole("button", { name: /run solver/i }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(
      screen.getByText(
        /calculation failed\. please verify your inputs and try again\./i,
      ),
    ).toBeInTheDocument();

    vi.useRealTimers();
  });
});
