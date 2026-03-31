import React from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const { message, type } = toast;
  const toastClass = (type === 'success' ? 'bg-green-500' : (type === 'error' ? 'bg-red-500' : (type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'))) + ' text-white p-3 rounded shadow-lg';
  return (
    <div className={toastClass} onClick={onClose} style={{ cursor: 'pointer' }}>
      {message}
    </div>
  );
};

export default Toast; 