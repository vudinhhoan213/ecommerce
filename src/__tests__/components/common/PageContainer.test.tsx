import React from "react";
import { render, screen } from "@testing-library/react";
import PageContainer from "../../../components/common/PageContainer";

describe("PageContainer", () => {
  it("should render children", () => {
    render(
      <PageContainer>
        <p>Hello World</p>
      </PageContainer>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("should render title when provided", () => {
    render(
      <PageContainer title="My Page">
        <p>Content</p>
      </PageContainer>
    );
    expect(screen.getByText("My Page")).toBeInTheDocument();
  });

  it("should render subtitle when provided", () => {
    render(
      <PageContainer title="Title" subtitle="Sub title">
        <p>Content</p>
      </PageContainer>
    );
    expect(screen.getByText("Sub title")).toBeInTheDocument();
  });

  it("should render headerRight when provided", () => {
    render(
      <PageContainer title="Title" headerRight={<button>Action</button>}>
        <p>Content</p>
      </PageContainer>
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("should render footer when provided", () => {
    render(
      <PageContainer footer={<div>Footer Content</div>}>
        <p>Content</p>
      </PageContainer>
    );
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("should not render header when no title or headerRight", () => {
    const { container } = render(
      <PageContainer>
        <p>Content</p>
      </PageContainer>
    );
    expect(container.querySelector(".pageHeader")).not.toBeInTheDocument();
  });

  it("should not render footer when not provided", () => {
    const { container } = render(
      <PageContainer>
        <p>Content</p>
      </PageContainer>
    );
    expect(container.querySelector(".footer")).not.toBeInTheDocument();
  });

  it("should render React node as title", () => {
    render(
      <PageContainer title={<span>Custom Title</span>}>
        <p>Content</p>
      </PageContainer>
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });
});
