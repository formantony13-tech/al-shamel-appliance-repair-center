/**
 * Anti-Spam & Rate-Limiting Protection for Customer Bookings & Review Submissions
 * Prevents automated bots, brute force requests, and accidental rapid-fire double clicks.
 */

const RATE_LIMIT_STORAGE_KEY = 'qotb_booking_submission_rate_v1';
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 minutes

interface SubmissionRecord {
  timestamps: number[];
  lastPhone?: string;
}

export function checkBookingSubmissionAllowed(phoneNumber: string): { allowed: boolean; error?: string } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const now = Date.now();
    let record: SubmissionRecord = raw ? JSON.parse(raw) : { timestamps: [] };

    // Clean up timestamps older than window
    record.timestamps = record.timestamps.filter(ts => now - ts < WINDOW_DURATION_MS);

    // Check rate limit count
    if (record.timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
      const oldest = record.timestamps[0];
      const waitMinutes = Math.ceil((WINDOW_DURATION_MS - (now - oldest)) / (60 * 1000));
      return {
        allowed: false,
        error: `تم إرسال عدة طلبات مؤخراً. يرجى الانتظار ${waitMinutes} دقيقة قبل إرسال طلب جديد، أو التواصل مباشرة عبر الواتساب/الهاتف.`
      };
    }

    // Check rapid submission (< 5 seconds between consecutive attempts)
    if (record.timestamps.length > 0) {
      const lastAttempt = record.timestamps[record.timestamps.length - 1];
      if (now - lastAttempt < 4000) {
        return {
          allowed: false,
          error: 'يرجى الانتظار بضع ثوانٍ قبل محاولة إرسال الطلب مجدداً'
        };
      }
    }

    return { allowed: true };
  } catch {
    // If localStorage is unavailable, allow submission
    return { allowed: true };
  }
}

export function recordBookingSubmission(phoneNumber: string): void {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const now = Date.now();
    let record: SubmissionRecord = raw ? JSON.parse(raw) : { timestamps: [] };

    record.timestamps = record.timestamps.filter(ts => now - ts < WINDOW_DURATION_MS);
    record.timestamps.push(now);
    record.lastPhone = phoneNumber;

    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage quota errors
  }
}

export interface SpamCheckOptions {
  honeypot?: string;
  formRenderTime?: number;
  minCompletionSeconds?: number;
  phoneNumber?: string;
}

export function checkSpamSubmission(options?: SpamCheckOptions): { allowed: boolean; reason?: string } {
  // 1. Honeypot check
  if (options?.honeypot && options.honeypot.trim().length > 0) {
    return {
      allowed: false,
      reason: 'تم اكتشاف إرسال آلي غير مصرح به'
    };
  }

  // 2. Minimum form fill time check (bots submit in < 1.5 seconds)
  if (options?.formRenderTime) {
    const elapsedMs = Date.now() - options.formRenderTime;
    const minSecs = options.minCompletionSeconds || 2;
    if (elapsedMs < minSecs * 1000) {
      return {
        allowed: false,
        reason: 'تم إرسال النموذج بسرعة غير طبيعية، يرجى التأكد من البيانات وإعادة المحاولة'
      };
    }
  }

  // 3. Rate limiter check
  const phone = options?.phoneNumber || '';
  const rateResult = checkBookingSubmissionAllowed(phone);
  if (!rateResult.allowed) {
    return {
      allowed: false,
      reason: rateResult.error
    };
  }

  return { allowed: true };
}

export function recordSubmission(phoneNumber?: string): void {
  recordBookingSubmission(phoneNumber || '');
}

