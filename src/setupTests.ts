// Polyfill TextEncoder/TextDecoder cho jsdom (react-router v7 cần)
const { TextEncoder, TextDecoder } = require("util");

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

// jest-dom matchers (toBeInTheDocument, toHaveAttribute, etc.)
import "@testing-library/jest-dom";
