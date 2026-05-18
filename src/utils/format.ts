export const formatVND = (num: number): string =>
  new Intl.NumberFormat("vi-VN").format(num) + " VND";
