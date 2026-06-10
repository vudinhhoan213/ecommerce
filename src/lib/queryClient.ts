import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data "tươi" trong 5 phút → không refetch nếu chưa hết hạn
      staleTime: 5 * 60 * 1000,
      // Cache giữ 10 phút sau khi không còn component subscribe
      gcTime: 10 * 60 * 1000,
      // Retry 2 lần khi lỗi (khoảng cách tăng dần)
      retry: 2,
      // Tự refetch khi user quay lại tab
      refetchOnWindowFocus: true,
      // Không refetch khi reconnect internet (tùy chọn)
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry 1 lần cho mutations
      retry: 1,
    },
  },
});
