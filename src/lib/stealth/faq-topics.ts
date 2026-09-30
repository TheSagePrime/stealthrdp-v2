export function faqCategoryId(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
