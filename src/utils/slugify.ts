export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const findIdBySlug = (
  products: { id: number; title: string }[],
  slug: string,
): number | undefined => {
  const found = products.find((p) => slugify(p.title) === slug);
  return found?.id;
};
