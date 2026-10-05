/* An anchor id for a FAQ category. Accents are dropped first, so "Precios y facturación"
   becomes "precios-y-facturacion" rather than "precios-y-facturaci-n". */
export function faqCategoryId(category: string): string {
  return category.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
