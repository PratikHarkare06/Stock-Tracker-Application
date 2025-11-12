import React, { useState, useCallback, useEffect } from 'react';
import { OverlapResult, MutualFund, Stock } from '../types';
import * as api from '../services/api';
import { webSocketService } from '../services/websocket';
import Spinner from './Spinner';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FundComparison: React.FC = () => {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [fund1Id, setFund1Id] = useState<string>('');
  const [fund2Id, setFund2Id] = useState<string>('');
  const [result, setResult] = useState<OverlapResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setIsLoading(true);
        const fetchedFunds = await api.getFunds();
        setFunds(fetchedFunds);
        setError('');
      } catch (err) {
        setError('Failed to load mutual funds. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFunds();
  }, []);

  useEffect(() => {
    const handlePriceUpdate = (updatedStock: Stock) => {
        setResult(prevResult => {
            if (!prevResult) return null;

            const newOverlappingStocks = prevResult.overlappingStocks.map(item => {
                if (item.stock.id === updatedStock.id) {
                    return { ...item, stock: updatedStock };
                }
                // Reset direction for other stocks to only flash the updated one
                const { price_change_direction, ...rest } = item.stock;
                return { ...item, stock: rest };
            });

            return { ...prevResult, overlappingStocks: newOverlappingStocks };
        });
    };
    
    webSocketService.subscribe(handlePriceUpdate);
    return () => webSocketService.unsubscribe(handlePriceUpdate);
  }, []);
  
  const handleCompare = useCallback(async () => {
    if (!fund1Id || !fund2Id) {
      setError('Please select two funds to compare.');
      setResult(null);
      return;
    }
    if (fund1Id === fund2Id) {
      setError('Please select two different funds.');
      setResult(null);
      return;
    }
    setError('');
    setIsComparing(true);

    try {
        const comparisonResult = await api.compareFunds(fund1Id, fund2Id);
        setResult(comparisonResult);
    } catch (err) {
        setError('Could not compare funds. An error occurred.');
        setResult(null);
    } finally {
        setIsComparing(false);
    }

  }, [fund1Id, fund2Id]);
  
  const COLORS = ['#2dd4bf', '#0284c7', '#f97316', '#8b5cf6', '#ec4899'];

  const getPriceChangeClass = (direction?: 'up' | 'down' | 'none') => {
    switch (direction) {
        case 'up': return 'bg-green-500/20';
        case 'down': return 'bg-red-500/20';
        default: return '';
    }
  };

  const renderChart = (totalOverlap: number, fundName: string) => {
    const data = [
        { name: 'Overlapping', value: parseFloat(totalOverlap.toFixed(2)) },
        { name: 'Unique', value: parseFloat((100 - totalOverlap).toFixed(2)) },
    ];
    return (
        <div className="w-full h-64 flex flex-col items-center">
            <h4 className="text-lg font-semibold text-text-primary mb-2">{fundName}</h4>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                       <Cell key={`cell-0`} fill={COLORS[0]} />
                       <Cell key={`cell-1`} fill={'#334155'} />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-4 text-secondary">Compare Mutual Funds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={fund1Id}
            onChange={(e) => setFund1Id(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
            disabled={isLoading}
          >
            <option value="">Select First Fund</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>{fund.name}</option>
            ))}
          </select>
          <select
            value={fund2Id}
            onChange={(e) => setFund2Id(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
            disabled={isLoading}
          >
            <option value="">Select Second Fund</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>{fund.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCompare}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-hover transition duration-300 flex items-center justify-center disabled:bg-slate-600"
          disabled={isComparing}
        >
          {isComparing ? <><Spinner size="sm" /> Comparing...</> : 'Compare'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {result && (
        <div className="bg-card p-6 rounded-lg border border-border animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-center">Comparison Result</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {renderChart(result.totalOverlapPercentage1, result.fund1Name)}
              {renderChart(result.totalOverlapPercentage2, result.fund2Name)}
          </div>

          <h4 className="text-lg font-semibold mb-2">Overlapping Stocks ({result.overlappingStocks.length})</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50">
                  <th className="p-3">Stock Name</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3 text-right">{result.fund1Name} (%)</th>
                  <th className="p-3 text-right">{result.fund2Name} (%)</th>
                </tr>
              </thead>
              <tbody>
                {result.overlappingStocks.map(({ stock, percentage1, percentage2 }) => (
                  <tr key={stock.id} className={`border-b border-border transition-colors duration-500 ${getPriceChangeClass(stock.price_change_direction)}`}>
                    <td className="p-3 font-medium">{stock.name} ({stock.symbol})</td>
                    <td className="p-3 font-mono">{stock.price.toFixed(2)}</td>
                    <td className="p-3 text-right">{percentage1.toFixed(2)}%</td>
                    <td className="p-3 text-right">{percentage2.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundComparison;