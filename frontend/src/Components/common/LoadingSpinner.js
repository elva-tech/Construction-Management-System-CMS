import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSpinner = () => {
  return React.createElement('div', {
    className: 'flex items-center justify-center w-full h-full min-h-[200px]'
  },
    React.createElement('div', {
      className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BAFD4]'
    })
  );
};

export const LoadingBar = () => 
  React.createElement('div', {
    className: 'fixed top-0 left-0 right-0 z-50'
  },
    React.createElement('div', {
      className: 'h-1 bg-[#7BAFD4] animate-pulse'
    })
  );

export default LoadingSpinner; 