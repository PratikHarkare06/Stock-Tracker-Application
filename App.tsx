import React, { useState } from 'react';
import Header from './components/Header';
import FundComparison from './components/FundComparison';
import StockInsights from './components/StockInsights';
import IndicesOverview from './components/IndicesOverview';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import MutualFundsList from './components/MutualFundsList';
import Login from './components/Login';

export enum View {
  DASHBOARD,
  FUNDS,
  COMPARE,
  STOCKS,
  INDICES,
  ADMIN,
  LOGIN,
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const renderView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard setActiveView={setActiveView} />;
      case View.FUNDS:
        return <MutualFundsList />;
      case View.COMPARE:
        return <FundComparison />;
      case View.STOCKS:
        return <StockInsights />;
      case View.INDICES:
        return <IndicesOverview />;
      case View.ADMIN:
        return isAuthenticated ? <AdminDashboard setActiveView={setActiveView} /> : <Login setActiveView={setActiveView} setIsAuthenticated={setIsAuthenticated} />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
      <footer className="text-center p-4 text-text-secondary text-sm mt-8 border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} Stock Tracker. All data is for demonstration purposes only.</p>
      </footer>
    </div>
  );
};

export default App;