import { useQuery } from "@tanstack/react-query";
import { searchSuggestApi } from "../api/searchSuggestApi";

// =============================================
// QUERY KEYS
// =============================================

export const suggestKeys = {
  all: ["searchSuggest"] as const,
  keyword: (keyword: string) => [...suggestKeys.all, keyword] as const,
};

// =============================================
// HOOK
// =============================================

/**
 * Hook gợi ý tìm kiếm (autocomplete)
 * - Debounce ở component (300ms) → truyền debouncedKeyword vào
 * - enabled: chỉ gọi khi keyword không rỗng
 * - staleTime ngắn (30s) vì suggest thay đổi thường xuyên
 * - gcTime ngắn (1 phút) vì data suggest ít có giá trị cache lâu
 */
export function useSearchSuggest(debouncedKeyword: string) {
  return useQuery({
    queryKey: suggestKeys.keyword(debouncedKeyword),
    queryFn: () => searchSuggestApi.getSuggestions(debouncedKeyword),
    enabled: debouncedKeyword.trim().length > 0,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });
}
