import { useRef, useEffect, useCallback } from "react";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

/**
 * useDebounceSearch — RxJS-powered debounce hook
 *
 * Thay thế setTimeout thủ công bằng RxJS stream:
 * - debounceTime: đợi user ngừng gõ rồi mới emit
 * - distinctUntilChanged: bỏ qua nếu value không đổi (gõ "abc" → xóa → gõ lại "abc" = không trigger)
 *
 * @param callback - Hàm được gọi sau khi debounce (nhận value đã debounce)
 * @param delay - Thời gian debounce (ms), mặc định 500ms
 * @returns emit function — gọi mỗi lần input thay đổi
 *
 * @example
 * const emit = useDebounceSearch((val) => setDebouncedSearch(val), 500);
 * <Input onChange={(e) => emit(e.target.value)} />
 */
export function useDebounceSearch(
  callback: (value: string) => void,
  delay = 500,
) {
  // Subject tồn tại suốt vòng đời component
  const subject$ = useRef(new Subject<string>()).current;

  // Lưu callback mới nhất mà không cần re-subscribe
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const subscription = subject$
      .pipe(
        debounceTime(delay), // Đợi ngừng gõ {delay}ms
        distinctUntilChanged(), // Bỏ qua nếu giá trị giống lần trước
      )
      .subscribe((value) => {
        callbackRef.current(value);
      });

    // CLEANUP: unsubscribe khi unmount → không memory leak
    return () => subscription.unsubscribe();
  }, [subject$, delay]);

  // Trả về hàm emit ổn định (không thay đổi reference giữa các render)
  return useCallback((value: string) => subject$.next(value), [subject$]);
}
