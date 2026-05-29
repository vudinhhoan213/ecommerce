import { formatVND } from "../../utils/format";

// ============================================================
// TEST SUITE: formatVND utility function
// ============================================================
describe("formatVND", () => {
  it("should format number with Vietnamese locale and VND suffix", () => {
    expect(formatVND(25000000)).toBe("25.000.000 VND");
  });

  it("should format zero", () => {
    expect(formatVND(0)).toBe("0 VND");
  });

  it("should format small numbers without separators", () => {
    expect(formatVND(999)).toBe("999 VND");
  });

  it("should format thousands with dot separator", () => {
    expect(formatVND(1000)).toBe("1.000 VND");
  });

  it("should format large numbers correctly", () => {
    expect(formatVND(1500000000)).toBe("1.500.000.000 VND");
  });
});
