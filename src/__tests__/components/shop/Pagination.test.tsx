import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../../../components/shop/Pagination";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const map = {
        "shop.prevPage": "Previous",
        "shop.nextPage": "Next",
      };
      return map[key] || key;
    },
  }),
}));

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("should return null when totalPages <= 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render page buttons for all pages", () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render Previous and Next buttons", () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("should disable Previous button on first page", () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    render(<Pagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("should call onPageChange when clicking a page number", async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText("2"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange with previous page when clicking Previous", async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText("Previous"));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("should call onPageChange with next page when clicking Next", async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText("Next"));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });
});
