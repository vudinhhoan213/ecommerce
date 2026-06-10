import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { Product } from "../../../types";
import { productApi } from "../api/productApi";

// =============================================
// QUERY KEYS — Factory Pattern
//
// Mô hình phân cấp:
//   ['products']                        ← all (invalidate tất cả)
//   ['products', 'list']                ← lists
//   ['products', 'list', { search }]    ← filtered list
//   ['products', 'detail']              ← all details
//   ['products', 'detail', id]          ← specific detail
//
// =============================================

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
};

// =============================================
// QUERIES (đọc dữ liệu)
// =============================================

/**
 * Lấy toàn bộ danh sách sản phẩm
 */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: productApi.getAll,
  });
}

/**
 * Tìm kiếm sản phẩm theo keyword
 *
 * - enabled: chỉ gọi khi có searchTerm
 * - placeholderData: giữ data cũ khi đang fetch mới (tránh nhấp nháy)
 */
export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: productKeys.list({ search: searchTerm }),
    queryFn: () => productApi.search(searchTerm),
    enabled: searchTerm.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}

/**
 * Lấy chi tiết sản phẩm theo ID
 */
export function useProductById(id: string | number | undefined | null) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => productApi.getById(id!),
    enabled: !!id,
  });
}

// =============================================
// MUTATIONS (tạo/sửa/xóa)
// =============================================

/**
 * Tạo sản phẩm mới
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * Cập nhật sản phẩm
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.update,
    onSuccess: (updatedProduct) => {
      // Cập nhật cache chi tiết
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct,
      );
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * Xóa sản phẩm — Optimistic Update
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.delete,

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });
      const previousProducts = queryClient.getQueryData<Product[]>(
        productKeys.lists(),
      );
      queryClient.setQueryData<Product[]>(
        productKeys.lists(),
        (old) => old?.filter((p) => p.id !== productId) ?? [],
      );
      return { previousProducts };
    },

    onError: (_err, _productId, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.lists(), context.previousProducts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
