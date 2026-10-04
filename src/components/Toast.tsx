import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-24 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-right animate-slideIn ${
              isSuccess
                ? 'bg-emerald-800 text-white border-emerald-700'
                : isError
                ? 'bg-red-800 text-white border-red-700'
                : 'bg-[#123b4a] text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
              {isError && <AlertTriangle className="w-5 h-5 text-red-300 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#d97706] shrink-0" />}
              <span className="text-xs sm:text-sm font-extrabold leading-snug">
                {toast.message}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
