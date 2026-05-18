import type { Product } from "./product.types";

export interface CartItem
  extends Pick<Product, "id" | "title" | "price" | "thumbnail" | "images" | "rating" | "colors"> {
  description?: string;
  image?: string;
  name?: string;
  selectedColor: string;
  quantity: number;
}

export interface CartState {
  cartList: CartItem[];
}
