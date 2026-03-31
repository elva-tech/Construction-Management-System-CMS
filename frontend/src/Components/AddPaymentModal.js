import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddPaymentModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    particulars: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    paidThrough: "Cash",
    remarks: "-"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      amount: parseInt(formData.amount)
    });
    onClose();
    setFormData({
      particulars: "",
      date: new Date().toISOString().split('T')[0],
      amount: "",
      paidThrough: "Cash",
      remarks: "-"
    });
  };

  if (!isOpen) return null;

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  },
    React.createElement('div', {
      className: 'bg-white rounded-lg p-6 w-full max-w-md'
    },
      React.createElement('div', {
        className: 'flex justify-between items-center mb-4'
      },
        React.createElement('h2', {
          className: 'text-xl font-semibold'
        }, 'Add New Payment Entry'),
        React.createElement('button', {
          onClick: onClose,
          className: 'text-gray-500 hover:text-gray-700'
        },
          React.createElement(X, { size: 20 })
        )
      ),
      React.createElement('form', {
        onSubmit: handleSubmit,
        className: 'space-y-4'
      },
        React.createElement('div', null,
          React.createElement('label', {
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Particulars'),
          React.createElement('input', {
            type: 'text',
            value: formData.particulars,
            onChange: (e) => setFormData({ ...formData, particulars: e.target.value }),
            className: 'w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
            placeholder: 'e.g., Installment - 6',
            required: true
          })
        ),
        React.createElement('div', null,
          React.createElement('label', {
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Date'),
          React.createElement('input', {
            type: 'date',
            value: formData.date,
            onChange: (e) => setFormData({ ...formData, date: e.target.value }),
            className: 'w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
            required: true
          })
        ),
        React.createElement('div', null,
          React.createElement('label', {
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Amount (₹)'),
          React.createElement('input', {
            type: 'number',
            value: formData.amount,
            onChange: (e) => setFormData({ ...formData, amount: e.target.value }),
            className: 'w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
            placeholder: 'Enter amount',
            min: '0',
            required: true
          })
        ),
        React.createElement('div', null,
          React.createElement('label', {
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Paid Through'),
          React.createElement('select', {
            value: formData.paidThrough,
            onChange: (e) => setFormData({ ...formData, paidThrough: e.target.value }),
            className: 'w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
            required: true
          },
            React.createElement('option', { value: 'Cash' }, 'Cash'),
            React.createElement('option', { value: 'Cheque' }, 'Cheque'),
            React.createElement('option', { value: 'Bank Transfer' }, 'Bank Transfer'),
            React.createElement('option', { value: 'UPI' }, 'UPI')
          )
        ),
        React.createElement('div', null,
          React.createElement('label', {
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Remarks'),
          React.createElement('input', {
            type: 'text',
            value: formData.remarks,
            onChange: (e) => setFormData({ ...formData, remarks: e.target.value }),
            className: 'w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
            placeholder: 'Optional remarks'
          })
        ),
        React.createElement('div', {
          className: 'flex justify-end space-x-3 pt-4'
        },
          React.createElement('button', {
            type: 'button',
            onClick: onClose,
            className: 'px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600'
          }, 'Add Payment')
        )
      )
    )
  );
};

export default AddPaymentModal; 