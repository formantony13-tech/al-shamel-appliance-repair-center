import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Translates Firebase Auth & Firestore technical errors into friendly Arabic messages
 */
export function getArabicFirebaseErrorMessage(error: any): string {
  if (!error) return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';

  const code = error?.code || '';
  const message = error?.message || String(error);

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    case 'auth/email-already-in-use':
      return 'هذا البريد الإلكتروني مسجل بالفعل مسبقاً';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة، يرجى استخدام 6 خانات على الأقل تشمل أرقام وحروف';
    case 'auth/invalid-email':
      return 'صيغة البريد الإلكتروني غير صحيحة';
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب من قبل الإدارة';
    case 'auth/popup-closed-by-user':
      return 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية';
    case 'auth/network-request-failed':
      return 'تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت';
    case 'auth/too-many-requests':
      return 'تم تجاوز عدد المحاولات المسموح بها، يرجى الانتظار بضع دقائق ثم المحاولة مجدداً';
    case 'permission-denied':
      return 'عفواً، ليس لديك الصلاحية الكافية لإتمام هذا الإجراء';
    case 'unavailable':
      return 'الخدمة غير متوفرة حالياً، جاري العمل في وضع عدم الاتصال';
    case 'resource-exhausted':
      return 'تم تجاوز الحصة المسموح بها، يرجى المحاولة لاحقاً';
    default:
      if (message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
        return 'عفواً، تم رفض الإجراء لعدم كفاية الصلاحيات الأمنية';
      }
      return message;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(getArabicFirebaseErrorMessage(error));
}

