import {
  selectProducts,
  selectCurrentProduct,
  selectFetchLoading,
  selectMutateLoading,
  selectProductError,
  selectSearchTerm,
  selectDebouncedSearch,
} from "../../../store/product/productSelectors";

const mockProduct = {
  id: 1,
  title: "iPhone 15",
  description: "Latest iPhone",
  price: 1000000,
  thumbnail: "img.jpg",
  images: ["img.jpg"],
  rating: 4.5,
};

const mockState: any = {
  product: {
    products: [mockProduct],
    currentProduct: mockProduct,
    fetchLoading: false,
    mutateLoading: true,
    error: "Some error",
    searchTerm: "iphone",
    debouncedSearch: "iphone",
  },
};

describe("productSelectors", () => {
  it("selectProducts should return products array", () => {
    expect(selectProducts(mockState)).toEqual([mockProduct]);
  });

  it("selectCurrentProduct should return currentProduct", () => {
    expect(selectCurrentProduct(mockState)).toEqual(mockProduct);
  });

  it("selectFetchLoading should return fetchLoading", () => {
    expect(selectFetchLoading(mockState)).toBe(false);
  });

  it("selectMutateLoading should return mutateLoading", () => {
    expect(selectMutateLoading(mockState)).toBe(true);
  });

  it("selectProductError should return error", () => {
    expect(selectProductError(mockState)).toBe("Some error");
  });

  it("selectSearchTerm should return searchTerm", () => {
    expect(selectSearchTerm(mockState)).toBe("iphone");
  });

  it("selectDebouncedSearch should return debouncedSearch", () => {
    expect(selectDebouncedSearch(mockState)).toBe("iphone");
  });

  it("selectCurrentProduct should return null when no product selected", () => {
    const state = {
      ...mockState,
      product: { ...mockState.product, currentProduct: null },
    };
    expect(selectCurrentProduct(state)).toBeNull();
  });
});
