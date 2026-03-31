import React from 'react';

const Table = ({
  columns,
  data,
  showHeader = true,
  className = '',
  onRowClick,
  hoverable = true,
  compact = false
}) => {
  const baseTableStyles = 'w-full table-auto text-left bg-white shadow-sm rounded-lg overflow-hidden';
  const baseHeaderStyles = 'bg-gray-200 border-b border-gray-200';
  const baseCellStyles = 'p-3 text-sm';
  const baseRowStyles = 'border-t';

  return React.createElement('div', { className: 'overflow-x-auto' },
    React.createElement('table', { className: `${baseTableStyles} ${className}` },
      showHeader && React.createElement('thead', { className: baseHeaderStyles },
        React.createElement('tr', null,
          columns.map((column, index) =>
            React.createElement('th', {
              key: column.key || index,
              className: `${baseCellStyles} font-semibold ${column.className || ''}`,
              style: column.width ? { width: column.width } : {}
            }, column.header)
          )
        )
      ),
      React.createElement('tbody', null,
        data.map((row, rowIndex) =>
          React.createElement('tr', {
            key: row.id || rowIndex,
            className: `
              ${baseRowStyles}
              ${hoverable ? 'hover:bg-gray-50' : ''}
              ${onRowClick ? 'cursor-pointer' : ''}
              ${compact ? 'h-10' : ''}
            `,
            onClick: () => onRowClick && onRowClick(row)
          },
            columns.map((column, colIndex) =>
              React.createElement('td', {
                key: `${row.id || rowIndex}-${column.key || colIndex}`,
                className: `${baseCellStyles} ${column.cellClassName || ''}`
              },
                column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]
              )
            )
          )
        )
      )
    )
  );
};

export default Table; 