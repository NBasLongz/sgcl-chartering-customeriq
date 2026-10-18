'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl border border-slate-700 z-50 flex items-center space-x-2.5 animate-fade-in"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
      <span className="leading-snug">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-3 text-slate-400 hover:text-white font-bold cursor-pointer text-base"
        aria-label="Đóng thông báo"
      >
        &times;
      </button>
    </div>
  );
}
