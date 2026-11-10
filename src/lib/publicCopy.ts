const UNSUPPORTED_PROMISES = /(?:24\s*(?:ساعة|س|\/\s*7)|٢٤\s*(?:ساعة|س|\/\s*٧)|فوري(?:ة)?|فوراً|فورًا|مضمون(?:ة|ه)?|(?:100|١٠٠)\s*(?:%|٪)|أصلي(?:ة)?|موث(?:ق|قة)|معتمد(?:ة)?)/iu;
const UNSUPPORTED_LOCATIONS = /(?:أبو\s*المطامير|ابو\s*المطامير|الغربية|الشرقية|الإسكندرية|الاسكندرية|القاهرة|المحافظات?\s*المجاورة|المناطق\s*المجاورة|خارجها|خارج\s*المحافظة)/iu;

/** Use configured public copy only when it avoids unsubstantiated claims and old location names. */
export function safePublicCopy(value: string | null | undefined, fallback: string): string {
  const text = value?.trim();
  return text && !UNSUPPORTED_PROMISES.test(text) && !UNSUPPORTED_LOCATIONS.test(text) ? text : fallback;
}

/** Older Firestore settings may still contain the previous incorrect business location. */
export function safeRegionCopy(value: string | null | undefined, fallback = 'محافظة البحيرة'): string {
  const text = value?.trim();
  return text && !UNSUPPORTED_LOCATIONS.test(text) ? text : fallback;
}
