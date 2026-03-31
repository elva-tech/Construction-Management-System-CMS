import React from 'react';

const Input = ({
  type = 'text',
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  name,
  disabled = false,
  min,
  max,
  rows,
  ...props
}) => {
  const baseInputStyles = `
    w-full 
    border 
    border-gray-300 
    rounded-md 
    p-2 
    focus:outline-none 
    focus:ring-2 
    focus:ring-red-500 
    disabled:bg-gray-50 
    disabled:text-gray-500
  `;

  const inputProps = {
    type,
    value,
    onChange: (e) => onChange(e.target.value),
    placeholder,
    required,
    disabled,
    name,
    className: `${baseInputStyles} ${error ? 'border-red-500' : ''} ${className}`,
    min,
    max,
    ...props
  };

  const renderInput = () => {
    if (type === 'textarea') {
      return React.createElement('textarea', {
        ...inputProps,
        rows: rows || 3
      });
    }

    return React.createElement('input', inputProps);
  };

  return React.createElement('div', { className: 'mb-4' },
    label && React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' },
      label,
      required && React.createElement('span', { className: 'text-red-500 ml-1' }, '*')
    ),
    renderInput(),
    error && React.createElement('p', { className: 'mt-1 text-sm text-red-500' }, error)
  );
};

export default Input; 