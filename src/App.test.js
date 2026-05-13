import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders shop page", async () => {
  render(
    <MemoryRouter initialEntries={["/shop"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /mobile shopping/i })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: /shop/i })).toBeInTheDocument();
  expect(await screen.findByText(/products/i)).toBeInTheDocument();
});
