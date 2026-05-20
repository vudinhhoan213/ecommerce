import { useRef, useEffect, useState, useCallback } from "react";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
  filter,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export interface SearchResult {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

interface ProductSearchResponse {
  products: SearchResult[];
  total: number;
}

/**
 * useProductSearch — RxJS-powered typeahead autocomplete
 *
 * Sử dụng switchMap để TỰ ĐỘNG CANCEL request trước đó khi user gõ tiếp.
 * → Không bao giờ bị race condition (response cũ ghi đè response mới).
 *
 * Flow:
 *   User gõ → debounce 300ms → switchMap(call API) → results
 *                                  ↑
 *                          cancel request cũ nếu có
 *
 * @param delay - Thời gian debounce (ms), mặc định 300ms
 * @returns { results, loading, search, clear }
 *
 * @example
 * const { results, loading, search, clear } = useProductSearch();
 * <Input onChange={(e) => search(e.target.value)} />
 * {results.map(p => <div key={p.id}>{p.title}</div>)}
 */
export function useProductSearch(delay = 300) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search$ = useRef(new Subject<string>()).current;

  useEffect(() => {
    const subscription = search$
      .pipe(
        debounceTime(delay),
        distinctUntilChanged(),
        tap((keyword) => {
          // Nếu keyword rỗng → clear results ngay, không gọi API
          if (!keyword.trim()) {
            setResults([]);
            setLoading(false);
          }
        }),
        // Chỉ gọi API khi có keyword
        filter((keyword) => keyword.trim().length > 0),
        tap(() => setLoading(true)),
        // switchMap: cancel request cũ → chỉ giữ request mới nhất
        switchMap((keyword) =>
          ajax
            .getJSON<ProductSearchResponse>(
              `${BASE_URL}/products/search?q=${encodeURIComponent(keyword)}&limit=8`,
            )
            .pipe(
              catchError(() => {
                // Lỗi network/server → trả mảng rỗng, không crash
                return of({ products: [], total: 0 } as ProductSearchResponse);
              }),
            ),
        ),
      )
      .subscribe((response) => {
        setResults(response.products || []);
        setLoading(false);
      });

    // CLEANUP: unsubscribe khi unmount
    return () => subscription.unsubscribe();
  }, [search$, delay]);

  // Hàm emit keyword vào stream
  const search = useCallback(
    (keyword: string) => search$.next(keyword),
    [search$],
  );

  const clear = useCallback(() => {
    setResults([]);
    setLoading(false);
  }, []);

  return { results, loading, search, clear };
}
