export function findMainImage<T extends { isMain: boolean }>(
  images: T[] | null | undefined,
): T | null {
  if (!images || images.length === 0) return null;
  return images.find((image) => image.isMain) || null;
}

export function generateSKU(productId: string) {
  return productId.substring(0, 8).toUpperCase();
}
