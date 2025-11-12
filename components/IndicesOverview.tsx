import React, { useState, useEffect } from 'react';
import { Index } from '../types';
import * as api from '../services/api';
import Spinner from './Spinner';

const IndicesOverview: React.FC = () => {
  const [indices, setIndices] = useState<Index[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        setIsLoading(true);
        const fetchedIndices = await api.getIndices();
        setIndices(fetchedIndices);
        setError(null);
      } catch (err) {
        setError('Failed to load market indices. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIndices();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
       <div className="bg-card p-6 rounded-lg border border-border text-center">
         <h2 className="text-2xl font-bold mb-6 text-secondary">Market Indices Overview</h2>
         <p className="text-red-400">{error}</p>
       </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6 text-secondary">Market Indices Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {indices.map((index: Index) => {
          const isPositive = index.change >= 0;
          return (
            <div key={index.id} className="bg-background/50 p-5 rounded-lg border border-border transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-lg font-bold text-text-primary">{index.name}</h3>
              <p className="text-2xl font-extrabold my-2 text-white">{index.value.toLocaleString('en-IN')}</p>
              <div className={`flex items-center text-md font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{index.change.toFixed(2)} ({index.percent_change.toFixed(2)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndicesOverview;