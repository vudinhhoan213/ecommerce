import searchSuggestReducer, {
  searchSuggest,
  searchSuggestSuccess,
  searchSuggestFailed,
  searchSuggestClear,
} from "../../../store/product/searchSuggestSlice";

const initialState = {
  results: [],
  loading: false,
  error: "",
};

const mockResults = [
  { id: 1, title: "iPhone 15", thumbnail: "img1.jpg", price: 1000000 },
  { id: 2, title: "iPhone 14", thumbnail: "img2.jpg", price: 800000 },
];

describe("searchSuggestSlice", () => {
  it("should return initial state", () => {
    expect(searchSuggestReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("searchSuggest", () => {
    it("should set loading to true when query is not empty", () => {
      const state = searchSuggestReducer(initialState, searchSuggest("iphone"));
      expect(state.loading).toBe(true);
      expect(state.error).toBe("");
    });

    it("should not set loading when query is empty/whitespace", () => {
      const state = searchSuggestReducer(initialState, searchSuggest("   "));
      expect(state.loading).toBe(false);
    });
  });

  describe("searchSuggestSuccess", () => {
    it("should set results and stop loading", () => {
      const loadingState = { ...initialState, loading: true };
      const state = searchSuggestReducer(loadingState, searchSuggestSuccess(mockResults));
      expect(state.results).toEqual(mockResults);
      expect(state.loading).toBe(false);
    });
  });

  describe("searchSuggestFailed", () => {
    it("should set error and stop loading", () => {
      const loadingState = { ...initialState, loading: true };
      const state = searchSuggestReducer(loadingState, searchSuggestFailed("Network error"));
      expect(state.error).toBe("Network error");
      expect(state.loading).toBe(false);
    });
  });

  describe("searchSuggestClear", () => {
    it("should reset to initial state", () => {
      const dirtyState = { results: mockResults, loading: true, error: "err" };
      const state = searchSuggestReducer(dirtyState, searchSuggestClear());
      expect(state).toEqual(initialState);
    });
  });
});
