import { slugify, findIdBySlug } from "../../utils/slugify";

describe("slugify", () => {
  it("should convert to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("should replace spaces with hyphens", () => {
    expect(slugify("foo bar baz")).toBe("foo-bar-baz");
  });

  it("should remove Vietnamese diacritics", () => {
    expect(slugify("Điện thoại")).toBe("dien-thoai");
  });

  it("should handle đ character", () => {
    expect(slugify("Đồng hồ")).toBe("dong-ho");
  });

  it("should remove special characters", () => {
    expect(slugify("Hello! @World#")).toBe("hello-world");
  });

  it("should trim leading and trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("should replace multiple consecutive hyphens with single hyphen", () => {
    expect(slugify("foo---bar")).toBe("foo-bar");
  });

  it("should handle empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("should handle numbers", () => {
    expect(slugify("iPhone 15 Pro Max")).toBe("iphone-15-pro-max");
  });
});

describe("findIdBySlug", () => {
  const products = [
    { id: 1, title: "iPhone 15" },
    { id: 2, title: "Galaxy S24" },
    { id: 3, title: "Điện thoại Xiaomi" },
  ];

  it("should find product id by slug", () => {
    expect(findIdBySlug(products, "iphone-15")).toBe(1);
  });

  it("should find product with Vietnamese title", () => {
    expect(findIdBySlug(products, "dien-thoai-xiaomi")).toBe(3);
  });

  it("should return undefined when slug not found", () => {
    expect(findIdBySlug(products, "not-exist")).toBeUndefined();
  });

  it("should return undefined for empty products array", () => {
    expect(findIdBySlug([], "iphone-15")).toBeUndefined();
  });
});
