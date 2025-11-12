import React, { useState, useMemo, useEffect } from 'react';
import FundIcon from './icons/FundIcon';
import * as api from '../services/api';
import { MutualFund } from '../types';
import Spinner from './Spinner';

const MutualFundsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAmc, setSelectedAmc] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setIsLoading(true);
        const fetchedFunds = await api.getFunds();
        setFunds(fetchedFunds);
        setError(null);
      } catch (err) {
        setError("Failed to load mutual funds. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFunds();
  }, []);

  const amcs = useMemo(() => ['All', ...new Set(funds.map(fund => fund.amc))], [funds]);
  const categories = useMemo(() => ['All', ...new Set(funds.map(fund => fund.category))], [funds]);

  const filteredFunds = useMemo(() => {
    return funds.filter(fund => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = 
        fund.name.toLowerCase().includes(lowercasedSearchTerm) ||
        fund.amc.toLowerCase().includes(lowercasedSearchTerm) ||
        fund.category.toLowerCase().includes(lowercasedSearchTerm);
        
      const matchesAmc = selectedAmc === 'All' || fund.amc === selectedAmc;
      const matchesCategory = selectedCategory === 'All' || fund.category === selectedCategory;
      return matchesSearch && matchesAmc && matchesCategory;
    });
  }, [searchTerm, selectedAmc, selectedCategory, funds]);

  return (
    <div className="animate-fade-in">
      <div className="bg-card p-6 rounded-lg border border-border mb-8">
        <h2 className="text-2xl font-bold mb-4 text-secondary">Browse Mutual Funds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name, AMC, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary md:col-span-3"
            disabled={isLoading}
          />
          <select
            value={selectedAmc}
            onChange={(e) => setSelectedAmc(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          >
            {amcs.map(amc => (
              <option key={amc} value={amc}>{amc === 'All' ? 'All AMCs' : amc}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category === 'All' ? 'All Categories' : category}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><Spinner /></div>
      ) : error ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <p className="text-xl text-red-400">{error}</p>
        </div>
      ) : filteredFunds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunds.map(fund => (
            <div
              key={fund.id}
              className="bg-card rounded-lg p-6 border border-border
                         transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group hover:border-secondary"
            >
              <div className="flex items-start">
                  <div className="p-2 bg-border rounded-full mr-4">
                    <FundIcon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-secondary transition-colors duration-300">{fund.name}</h3>
                    <p className="text-text-secondary">{fund.amc} • {fund.category}</p>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <p className="text-xl text-text-secondary">No funds found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MutualFundsList;