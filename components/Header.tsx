import React from 'react';
import { View } from '../App';
import CompareIcon from './icons/CompareIcon';
import StockIcon from './icons/StockIcon';
import IndexIcon from './icons/IndexIcon';
import DashboardIcon from './icons/DashboardIcon';
import AdminIcon from './icons/AdminIcon';
import FundIcon from './icons/FundIcon';
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, isAuthenticated, setIsAuthenticated }) => {
  
  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setActiveView(View.DASHBOARD);
    } else {
      setActiveView(View.ADMIN);
    }
  };

  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5 mr-2" />, onClick: () => setActiveView(View.DASHBOARD) },
    { view: View.FUNDS, label: 'Mutual Funds', icon: <FundIcon className="w-5 h-5 mr-2" />, onClick: () => setActiveView(View.FUNDS) },
    { view: View.COMPARE, label: 'Compare Funds', icon: <CompareIcon className="w-5 h-5 mr-2" />, onClick: () => setActiveView(View.COMPARE) },
    { view: View.STOCKS, label: 'Stock Insights', icon: <StockIcon className="w-5 h-5 mr-2" />, onClick: () => setActiveView(View.STOCKS) },
    { view: View.INDICES, label: 'Indices', icon: <IndexIcon className="w-5 h-5 mr-2" />, onClick: () => setActiveView(View.INDICES) },
  ];

  const adminNavItem = {
      label: isAuthenticated ? 'Logout' : 'Admin Panel',
      icon: isAuthenticated ? <LogoutIcon className="w-5 h-5 mr-2" /> : <AdminIcon className="w-5 h-5 mr-2" />,
      onClick: handleAdminClick,
      view: View.ADMIN
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM7.75 13.25a.75.75 0 001.5 0V9.31l2.22 2.22a.75.75 0 101.06-1.06l-3.5-3.5a.75.75 0 00-1.06 0l-3.5 3.5a.75.75 0 001.06 1.06l2.22-2.22v3.94z" clipRule="evenodd" />
                </svg>
            </div>
            <h1 className="text-xl font-bold ml-3 text-text-primary">Stock Tracker</h1>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeView === item.view
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-card hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
               <button
                  onClick={adminNavItem.onClick}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeView === adminNavItem.view
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-card hover:text-white'
                  }`}
                >
                  {adminNavItem.icon}
                  {adminNavItem.label}
                </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;