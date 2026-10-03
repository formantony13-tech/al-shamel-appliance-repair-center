export function validateEgyptianPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check if empty
  if (!cleaned) {
    return { isValid: false, normalized: '', error: 'يرجى إدخال رقم الهاتف' };
  }

  // Regex for Egyptian mobile: 010, 011, 012, 015 or with country code +20 / 0020
  const egMobileRegex = /^(?:\+?20|0020)?0?(1[0125][0-9]{8})$/;
  const match = cleaned.match(egMobileRegex);

  if (match) {
    const rawDigits = match[1]; // 10-digit number like 1066007455
    const normalized = `0${rawDigits}`; // Standard Egyptian 11 digits format: 01026663706
    return { isValid: true, normalized };
  }

  // If contains letters or invalid characters
  if (/[^\d\+]/.test(cleaned)) {
    return { isValid: false, normalized: cleaned, error: 'رقم الهاتف يجب أن يحتوي على أرقام فقط' };
  }

  // If length is incorrect
  if (cleaned.length < 10 || cleaned.length > 13) {
    return { isValid: false, normalized: cleaned, error: 'رقم الهاتف يجب أن يتكون من 11 رقماً (مثال: 01012345678)' };
  }

  return { isValid: true, normalized: cleaned };
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
