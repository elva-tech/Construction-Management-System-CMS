import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'rounded-md transition-colors font-medium flex items-center justify-center';
  
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300',
    success: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-md',
    lg: 'px-6 py-3 text-lg'
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return React.createElement('button', {
    type,
    onClick,
    disabled: disabled || isLoading,
    className: `${baseStyles} ${variantStyle} ${sizeStyle} ${className} ${
      disabled ? 'cursor-not-allowed opacity-60' : ''
    }`
  },
    icon && React.createElement('span', { className: 'mr-2' }, icon),
    isLoading ? 
      React.createElement('span', { className: 'inline-flex items-center' },
        React.createElement('svg', {
          className: 'animate-spin -ml-1 mr-2 h-4 w-4',
          fill: 'none',
          viewBox: '0 0 24 24'
        },
          React.createElement('circle', {
            className: 'opacity-25',
            cx: '12',
            cy: '12',
            r: '10',
            stroke: 'currentColor',
            strokeWidth: '4'
          }),
          React.createElement('path', {
            className: 'opacity-75',
            fill: 'currentColor',
            d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          })
        ),
        'Processing...'
      ) : 
      children
  );
};

export default Button; 