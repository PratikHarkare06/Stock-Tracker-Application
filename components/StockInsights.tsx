import React, { useState, useMemo, useEffect } from 'react';
import { Stock } from '../types';
import * as api from '../services/api';
import { webSocketService } from '../services/websocket';
import Spinner from './Spinner';

interface HoldingFundInfo {
  fundName: string;
  amc: string;
  percentage: number;
}

const StockInsights: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [holdingFunds, setHoldingFunds] = useState<HoldingFundInfo[]>([]);
  const [selectedSector, setSelectedSector] = useState('All');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingHoldings, setIsFetchingHoldings] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setIsLoading(true);
        const fetchedStocks = await api.getStocks();
        setStocks(fetchedStocks);
        setError(null);
      } catch (err) {
        setError('Failed to load stocks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    const handlePriceUpdate = (updatedStock: Stock) => {
        setStocks(prevStocks => 
            prevStocks.map(s => s.id === updatedStock.id ? updatedStock : s)
        );
        if (selectedStock && selectedStock.id === updatedStock.id) {
            setSelectedStock(updatedStock);
        }
    };
    
    webSocketService.subscribe(handlePriceUpdate);
    return () => webSocketService.unsubscribe(handlePriceUpdate);
  }, [selectedStock]);

  const sectors = useMemo(() => ['All', ...new Set(stocks.map(stock => stock.sector))], [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [searchTerm, selectedSector, stocks]);

  const handleStockSelect = async (stock: Stock) => {
    setSelectedStock(stock);
    setIsFetchingHoldings(true);
    setHoldingFunds([]);
    try {
      const funds = await api.getHoldingsForStock(stock.id);
      setHoldingFunds(funds);
    } catch (err) {
      setError(`Failed to load holding info for ${stock.name}.`);
    } finally {
      setIsFetchingHoldings(false);
    }
  };

  const getPriceChangeClass = (direction?: 'up' | 'down' | 'none') => {
    switch (direction) {
        case 'up': return 'text-green-400';
        case 'down': return 'text-red-400';
        default: return 'text-text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-4 text-secondary">Find a Stock</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary"
          />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector === 'All' ? 'All Sectors' : sector}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : error ? (
          <p className="text-red-400 mt-4 text-center">{error}</p>
        ) : (
          <ul className="max-h-96 overflow-y-auto mt-4 space-y-1">
            {filteredStocks.map(stock => (
              <li
                key={stock.id}
                onClick={() => handleStockSelect(stock)}
                className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${selectedStock?.id === stock.id ? 'bg-primary text-white' : 'hover:bg-border'}`}
              >
                <div className="font-bold">{stock.symbol}</div>
                <div className="text-sm text-text-secondary">{stock.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:col-span-2 bg-card p-6 rounded-lg border border-border">
        {selectedStock ? (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold mb-1">{selectedStock.name} ({selectedStock.symbol})</h3>
            <p className="text-text-secondary mb-6">
                Price: <span className={`font-bold transition-colors duration-500 ${getPriceChangeClass(selectedStock.price_change_direction)}`}>₹{selectedStock.price.toFixed(2)}</span> | Mkt Cap: ₹{(selectedStock.market_cap / 100000).toFixed(2)} Lakh Cr
            </p>
            
            <h4 className="text-xl font-semibold mb-4 text-secondary">Held By Mutual Funds</h4>
            {isFetchingHoldings ? (
              <div className="flex justify-center items-center h-48"><Spinner /></div>
            ) : holdingFunds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-background/50">
                      <th className="p-3">Fund Name</th>
                      <th className="p-3">AMC</th>
                      <th className="p-3 text-right">Holding (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdingFunds.map((fund, index) => (
                      <tr key={index} className="border-b border-border last:border-b-0">
                        <td className="p-3 font-medium">{fund.fundName}</td>
                        <td className="p-3">{fund.amc}</td>
                        <td className="p-3 text-right font-semibold">{fund.percentage.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-secondary">No holding information found in the tracked funds.</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-text-secondary">Select a stock to see insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockInsights;