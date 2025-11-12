import React, { useState, useRef, useEffect } from 'react';
import { BotLog } from '../types';
import UploadIcon from './icons/UploadIcon';
import * as api from '../services/api';
import Spinner from './Spinner';
import { View } from '../App';

interface Bot {
  name: string;
  description: string;
  id: string;
}

const BOTS: Bot[] = [
  {
    name: 'NSE Stock Information Bot',
    description: 'Scrapes NSE website for all listed stock symbols, price, market cap, etc. Runs daily.',
    id: 'nse-bot',
  },
  {
    name: 'AMC Portfolio Disclosure Bot',
    description: 'Downloads and processes portfolio disclosures from all AMC websites. Runs fortnightly/monthly.',
    id: 'amc-bot',
  },
  {
    name: 'Indices Data Bot',
    description: 'Downloads CSV files for major market indices like Nifty, Sensex, etc.',
    id: 'indices-bot',
  },
  {
    name: 'Firecrawl Web Scraper',
    description: 'Uses a live AI call to summarize market sentiment from the web.',
    id: 'firecrawl-bot',
  }
];

interface AdminDashboardProps {
    setActiveView: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveView }) => {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);
  const [runningBots, setRunningBots] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<{[key: string]: string}>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [lastScrapeResult, setLastScrapeResult] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<BotLog | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
        try {
            setIsLoadingLogs(true);
            const { logs: fetchedLogs, lastUpdated: fetchedLastUpdated } = await api.getBotLogs();
            setLogs(fetchedLogs);
            setLastUpdated(fetchedLastUpdated);
        } catch (error) {
            console.error("Failed to fetch bot logs");
        } finally {
            setIsLoadingLogs(false);
        }
    }
    fetchLogs();
  }, []);

  const runBot = async (bot: Bot) => {
    setRunningBots(prev => new Set(prev).add(bot.id));
    
    const optimisticLog: BotLog = {
      id: `log${Date.now()}`,
      botName: bot.name,
      status: 'In Progress',
      executionTime: 0,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [optimisticLog, ...prev]);

    try {
        const resultLog = await api.runBot(bot.id, bot.name);
        setLogs(prev => prev.map(log => log.id === optimisticLog.id ? resultLog : log));
        if (resultLog.status === 'Success') {
            setLastUpdated(prev => ({...prev, [bot.id]: new Date(resultLog.timestamp).toLocaleString()}));
            if(bot.id === 'firecrawl-bot' && resultLog.result) {
              setLastScrapeResult(resultLog.result);
            }
        }
    } catch (error) {
        setLogs(prev => prev.map(log => 
            log.id === optimisticLog.id 
            ? { ...log, status: 'Failure', executionTime: 1.0, result: error instanceof Error ? error.message : 'Unknown error' }
            : log
        ));
    } finally {
        setRunningBots(prev => {
            const newSet = new Set(prev);
            newSet.delete(bot.id);
            return newSet;
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');
    try {
        await api.uploadCsv(selectedFile);
        setUploadStatus('success');
        setSelectedFile(null);
    } catch (error) {
        setUploadStatus('error');
    }
  };
  
  const viewLogDetails = (log: BotLog) => {
    if (log.result) {
        setSelectedLog(log);
        setIsLogModalOpen(true);
    }
  };

  const getStatusColor = (status: BotLog['status']) => {
    switch (status) {
      case 'Success': return 'text-green-400';
      case 'Failure': return 'text-red-400';
      case 'In Progress': return 'text-yellow-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <>
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>

      {/* Bot Controls */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-4 text-secondary">RPA Bot Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BOTS.map(bot => (
            <div key={bot.id} className="bg-background/50 p-5 rounded-lg border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">{bot.name}</h3>
                <p className="text-sm text-text-secondary mt-2 mb-4 h-16">{bot.description}</p>
                <p className="text-xs text-text-secondary">Last updated: {lastUpdated[bot.id] || 'Never'}</p>
              </div>
              <button
                onClick={() => runBot(bot)}
                disabled={runningBots.has(bot.id)}
                className={`mt-4 w-full font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center
                  ${runningBots.has(bot.id) 
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-hover text-white'
                  }`}
              >
                {runningBots.has(bot.id) ? <><Spinner size="sm" /> Running...</> : 'Run Bot'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {lastScrapeResult && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4 text-secondary">Latest Scrape Result</h2>
          <p className="text-text-secondary whitespace-pre-wrap font-mono">{lastScrapeResult}</p>
        </div>
      )}

      {/* Manual Upload */}
      <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4 text-secondary">Manual Data Upload</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
              />
              <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex-shrink-0 bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-700 transition duration-300"
              >
                  Choose File
              </button>
              <span className="flex-grow text-text-secondary text-sm truncate">
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'No file chosen'}
              </span>
              <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                  className="w-full sm:w-auto flex items-center justify-center bg-primary text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-primary-hover"
              >
                  <UploadIcon className="w-5 h-5 mr-2" />
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload CSV'}
              </button>
          </div>
          {uploadStatus === 'success' && <p className="text-green-400 mt-4">File uploaded successfully!</p>}
          {uploadStatus === 'error' && <p className="text-red-400 mt-4">Upload failed. Please try again.</p>}
      </div>

      {/* Execution Logs */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-4 text-secondary">Execution Logs</h2>
        <div className="overflow-x-auto max-h-96">
          {isLoadingLogs ? (
            <div className="flex justify-center items-center h-48"><Spinner /></div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50">
                <th className="p-3">Bot Name</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Duration (s)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id} className={`border-b border-border last:border-b-0 ${index % 2 === 1 ? 'bg-background/30' : ''} ${log.result ? 'hover:bg-border/50 cursor-pointer' : ''}`} onClick={() => viewLogDetails(log)}>
                  <td className="p-3 font-medium">{log.botName}</td>
                  <td className="p-3 text-sm text-text-secondary">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className={`p-3 font-semibold ${getStatusColor(log.status)}`}>{log.status}</td>
                  <td className="p-3 text-right">{log.executionTime.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
    
    {isLogModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsLogModalOpen(false)}>
            <div className="bg-card rounded-lg shadow-2xl p-6 border border-border max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-secondary mb-2">Log Details</h3>
                <p className="text-sm text-text-secondary mb-4">{new Date(selectedLog.timestamp).toLocaleString()} - {selectedLog.botName}</p>
                <div className="bg-background p-4 rounded-md max-h-80 overflow-y-auto">
                    <p className="text-text-primary whitespace-pre-wrap font-mono text-sm">{selectedLog.result}</p>
                </div>
                 <button onClick={() => setIsLogModalOpen(false)} className="mt-6 bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition duration-300">
                    Close
                </button>
            </div>
        </div>
    )}
    </>
  );
};

export default AdminDashboard;