import React from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const sizeClass = sizes[size] || sizes.md;

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  },
    React.createElement('div', {
      className: `bg-white rounded-lg shadow-xl w-full ${sizeClass} mx-4 max-h-[90vh] overflow-y-auto ${className}`
    },
      // Header
      React.createElement('div', {
        className: 'flex justify-between items-center p-4 border-b border-gray-200'
      },
        React.createElement('h2', {
          className: 'text-xl font-semibold text-gray-900'
        }, title),
        showCloseButton && React.createElement('button', {
          onClick: onClose,
          className: 'text-gray-400 hover:text-gray-500 transition-colors'
        }, React.createElement(X, { size: 20 }))
      ),
      // Content
      React.createElement('div', {
        className: 'p-4'
      }, children)
    )
  );
};

export default Modal; 