import React, { useEffect } from 'react';
import { useToastContext } from './ToastContext';

const ToastContainer = () => {
  const { toast, removeToast } = useToastContext();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => { removeToast(); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  if (!toast) return null;

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
      {toast}
    </div>
  );
};

export default ToastContainer; 