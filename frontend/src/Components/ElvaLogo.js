import React from 'react';
import elvaLogo from '../Images/elva-logo-1.png';

const ElvaLogo = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={elvaLogo} 
        alt="ELVA - Elevating Value" 
        className="w-full h-auto"
      />
    </div>
  );
};

export default ElvaLogo;