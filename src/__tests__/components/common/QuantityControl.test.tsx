import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityControl from "../../../components/common/QuantityControl";

describe("QuantityControl", () => {
  const defaultProps = {
    quantity: 3,
    onIncrease: jest.fn(),
    onDecrease: jest.fn(),
    onChange: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onIncrease.mockClear();
    defaultProps.onDecrease.mockClear();
    defaultProps.onChange.mockClear();
  });

  it("should render quantity value in input", () => {
    render(<QuantityControl {...defaultProps} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(3);
  });

  it("should render + and - buttons", () => {
    render(<QuantityControl {...defaultProps} />);
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "-" })).toBeInTheDocument();
  });

  it("should call onIncrease when clicking + button", async () => {
    const user = userEvent.setup();
    render(<QuantityControl {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "+" }));
    expect(defaultProps.onIncrease).toHaveBeenCalledTimes(1);
  });

  it("should call onDecrease when clicking - button", async () => {
    const user = userEvent.setup();
    render(<QuantityControl {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "-" }));
    expect(defaultProps.onDecrease).toHaveBeenCalledTimes(1);
  });

  it("should call onChange with new value when input changes", async () => {
    const user = userEvent.setup();
    render(<QuantityControl {...defaultProps} />);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "5");

    expect(defaultProps.onChange).toHaveBeenCalledWith(5);
  });

  it("should not call onChange with invalid value (NaN)", async () => {
    const user = userEvent.setup();
    render(<QuantityControl {...defaultProps} />);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "abc");

    // onChange should not be called with NaN values
    const calls = defaultProps.onChange.mock.calls;
    calls.forEach((call: any[]) => {
      expect(call[0]).not.toBeNaN();
    });
  });
});
