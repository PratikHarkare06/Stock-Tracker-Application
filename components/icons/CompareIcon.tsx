
import React from 'react';

const CompareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="5" rx="2" ry="2"></rect>
    <rect x="2" y="16" width="20" height="5" rx="2" ry="2"></rect>
    <line x1="7" y1="11" x2="7" y2="11"></line>
    <line x1="12" y1="11" x2="12" y2="11"></line>
    <line x1="17" y1="11" x2="17" y2="11"></line>
  </svg>
);

export default CompareIcon;
   