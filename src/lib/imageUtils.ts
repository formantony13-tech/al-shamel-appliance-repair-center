import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Image processing & compression utility for client-side uploads.
 * Ensures images are validated for size, type, and resized to high-quality compressed JPEG.
 * Uploads to Firebase Storage with secure URL generation and robust partitioned paths.
 */

export interface ProcessedImage {
  dataUrl: string;
  blob: Blob;
  sizeBytes: number;
  width: number;
  height: number;
  mimeType: string;
}

export type StorageFolder = 
  | 'bookings' 
  | 'works' 
  | 'reviews' 
  | 'settings' 
  | 'for_sale' 
  | 'customers' 
  | 'repairs';

/**
 * Returns the secure partitioned storage path:
 * - Public: /public/works, /public/for_sale, /public/settings, /public/reviews
 * - Private: /private/bookings, /private/customers, /private/repairs
 */
export function getPartitionedPath(folder: StorageFolder, filename: string): string {
  if (folder === 'bookings' || folder === 'customers' || folder === 'repairs') {
    return `private/${folder}/${filename}`;
  }
  return `public/${folder}/${filename}`;
}

/**
 * Validates and compresses an image in memory via Canvas.
 * Strictly disallows SVG to eliminate SVG XSS vectors.
 */
export async function processImageUpload(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // 1. Explicitly forbid SVG
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      return reject(new Error('ملفات SVG غير مسموح بها لأسباب أمنية. يرجى رفع صورة بصيغة JPG أو PNG أو WebP.'));
    }

    // 2. Validate MIME Type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG أو PNG أو WebP'));
    }

    // 3. Validate Size (Max 8MB input limit)
    const maxInputSize = 8 * 1024 * 1024;
    if (file.size > maxInputSize) {
      return reject(new Error('حجم الصورة كبير جداً، الحد الأقصى المسموح به هو 8 ميجابايت'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل في قراءة ملف الصورة'));
    
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل في معالجة بيانات الصورة'));
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions keeping aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('تعذر إنشاء معالج الصور'));
        }

        // Draw and apply smooth bicubic sampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const outputMime = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('فشل في تحويل بيانات الصورة إلى ملف مضغوط'));
            }
            resolve({
              dataUrl,
              blob,
              sizeBytes: blob.size,
              width,
              height,
              mimeType: outputMime
            });
          },
          outputMime,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a Blob/File directly to Firebase Storage and returns the public download URL.
 */
export async function uploadImageToStorage(
  fileOrBlob: File | Blob,
  storagePath: string,
  contentType = 'image/jpeg'
): Promise<string> {
  try {
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, fileOrBlob, {
      contentType,
      customMetadata: {
        uploadedAt: new Date().toISOString()
      }
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err: any) {
    console.error('Firebase Storage upload failed:', err);
    throw new Error('فشل في رفع الصورة إلى السحابة، يرجى التحقق من اتصال الإنترنت وحجم الصورة');
  }
}

/**
 * Compresses an image and uploads it to Firebase Storage in one step.
 * Uses secure partitioned storage paths.
 * Storage-first approach: Only allows offline fallback when user is offline and limits base64.
 */
export async function compressAndUploadImage(
  file: File,
  folder: StorageFolder,
  filenamePrefix = 'img'
): Promise<{ url: string; sizeBytes: number; storagePath?: string }> {
  const processed = await processImageUpload(file, 1200, 1200, 0.82);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanPrefix = filenamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanPrefix}_${Date.now()}_${randomSuffix}.jpg`;
  const storagePath = getPartitionedPath(folder, filename);

  try {
    const downloadUrl = await uploadImageToStorage(processed.blob, storagePath, processed.mimeType);
    return {
      url: downloadUrl,
      sizeBytes: processed.sizeBytes,
      storagePath
    };
  } catch (err) {
    // If browser is offline, provide local temporary dataUrl for local preview
    if (!navigator.onLine) {
      console.warn('Network offline: using local image preview cache.');
      return {
        url: processed.dataUrl,
        sizeBytes: processed.sizeBytes,
        storagePath
      };
    }
    // If online, do not silently swallow storage failure into Firestore
    throw err;
  }
}
