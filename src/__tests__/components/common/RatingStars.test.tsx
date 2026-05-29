import React from "react";
import { render, screen } from "@testing-library/react";
import RatingStars from "../../../components/common/RatingStars";

// ===== MOCK: CSS module =====
jest.mock("./RatingStars.module.css", () => ({
  starsContainer: "starsContainer",
  starItem: "starItem",
}));

// ============================================================
// TEST SUITE: RatingStars component
// ============================================================
describe("RatingStars", () => {
  it("should render 5 stars total", () => {
    render(<RatingStars rating={3} />);

    const allStars = screen.getAllByText(/★|☆/);
    expect(allStars).toHaveLength(5);
  });

  it("should render correct number of filled stars (★)", () => {
    render(<RatingStars rating={4} />);

    const filledStars = screen.getAllByText("★");
    expect(filledStars).toHaveLength(4);
  });

  it("should render correct number of empty stars (☆)", () => {
    render(<RatingStars rating={2} />);

    const emptyStars = screen.getAllByText("☆");
    expect(emptyStars).toHaveLength(3); // 5 - 2 = 3 empty
  });

  it("should default to 5 filled stars when no rating provided", () => {
    render(<RatingStars />);

    const filledStars = screen.getAllByText("★");
    expect(filledStars).toHaveLength(5);
  });

  it("should render 0 filled stars for rating=0", () => {
    render(<RatingStars rating={0} />);

    const emptyStars = screen.getAllByText("☆");
    expect(emptyStars).toHaveLength(5);
  });
});
