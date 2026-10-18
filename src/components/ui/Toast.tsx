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
      className="fixed bottom-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 shadow-xl border border-slate-700 z-50 flex items-center space-x-2 animate-fade-in"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-3 text-slate-400 hover:text-white font-bold"
        aria-label="Đóng thông báo"
      >
        &times;
      </button>
    </div>
  );
}
