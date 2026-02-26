'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border ${bgColor} shadow-lg flex items-start gap-3 animate-slide-in`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${textColor}`} />
      <p className={textColor}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
