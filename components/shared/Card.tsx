import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-border ${className}`}>
      <div className="p-5 border-b border-gray-border flex items-center justify-between">
        <h3 className="text-md font-bold text-gray-dark flex items-center">
            {icon && <span className="mr-3 text-gray-medium">{icon}</span>}
            {title}
        </h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};