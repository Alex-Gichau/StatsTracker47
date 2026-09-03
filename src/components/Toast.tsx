import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  subMessage?: string;
  duration?: number;
}

export type ToastNotification = ToastMessage;

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
  onClose?: (id: string) => void;
}

interface ToastItemProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const duration = toast.duration || 3500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onClose]);

  return (
    <motion.div
      key={toast.id}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-auto bg-[#202124] text-white px-4 py-3 rounded-lg shadow-lg border border-[#3c4043] flex items-start gap-3 text-sm font-sans relative overflow-hidden"
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#81c995] shrink-0 mt-0.5" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#f28b82] shrink-0 mt-0.5" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-[#8ab4f8] shrink-0 mt-0.5" />}
      
      <div className="flex-1 min-w-0 pr-1">
        <p className="font-medium text-white text-xs sm:text-sm">{toast.message}</p>
        {toast.subMessage && <p className="text-xs text-[#9aa0a6] mt-0.5">{toast.subMessage}</p>}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="text-[#9aa0a6] hover:text-white p-1 -mr-1 rounded-md transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, onClose }) => {
  const handleClose = (id: string) => {
    if (onClose) onClose(id);
    if (onDismiss) onDismiss(id);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={handleClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Toast = ToastContainer;


