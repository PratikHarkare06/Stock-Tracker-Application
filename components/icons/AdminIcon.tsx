
import React from 'react';

const AdminIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.78a2 2 0 0 1-1.11 1.79l-1.44.82a2 2 0 0 0-1.11 1.79V11a2 2 0 0 0 2 2h.78a2 2 0 0 1 1.79 1.11l.82 1.44a2 2 0 0 0 1.79 1.11H11a2 2 0 0 0 2-2v-.78a2 2 0 0 1 1.11-1.79l1.44-.82a2 2 0 0 0 1.11-1.79V8a2 2 0 0 0-2-2h-.78a2 2 0 0 1-1.79-1.11l-.82-1.44A2 2 0 0 0 12.22 2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default AdminIcon;
