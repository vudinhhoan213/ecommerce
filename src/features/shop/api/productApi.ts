import type { Product } from "../../../types";
import { mapProduct, mapProducts } from "../../../mappers";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// =============================================
// HELPERS
// =============================================

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `API Error ${response.status}: ${errorBody || response.statusText}`,
    );
  }
  return response.json();
};

// =============================================
// API FUNCTIONS
// =============================================

export const productApi = {
  /** GET /products — Lấy toàn bộ danh sách */
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<{ products: Product[] }>(response);
    return mapProducts(data.products);
  },

  /** GET /products/:id — Chi tiết sản phẩm */
  getById: async (id: string | number): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse<Product>(response);
    return mapProduct(data);
  },

  /** GET /products/search?q= — Tìm kiếm sản phẩm */
  search: async (query: string): Promise<Product[]> => {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
      { headers: getHeaders() },
    );
    const data = await handleResponse<{ products: Product[] }>(response);
    return mapProducts(data.products);
  },

  /** POST /products/add — Tạo sản phẩm mới */
  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await handleResponse<Product>(response);
    return mapProduct(data);
  },

  /** PUT /products/:id — Cập nhật sản phẩm */
  update: async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<Product>;
  }): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const resData = await handleResponse<Product>(response);
    return mapProduct(resData);
  },

  /** DELETE /products/:id — Xóa sản phẩm */
  delete: async (id: number): Promise<number> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    await handleResponse<unknown>(response);
    return id;
  },
};
