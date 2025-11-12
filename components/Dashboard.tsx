import React from 'react';
import { View } from '../App';
import CompareIcon from './icons/CompareIcon';
import StockIcon from './icons/StockIcon';
import IndexIcon from './icons/IndexIcon';
import AdminIcon from './icons/AdminIcon';
import FundIcon from './icons/FundIcon';

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const featureCards = [
        {
            title: 'Browse Mutual Funds',
            description: 'Explore a detailed list of all available mutual funds. Search and filter by name or AMC.',
            icon: <FundIcon className="w-12 h-12 text-secondary mb-4" />,
            view: View.FUNDS,
        },
        {
            title: 'Compare Mutual Funds',
            description: 'Select two funds to see their portfolio overlap and analyze common stock holdings.',
            icon: <CompareIcon className="w-12 h-12 text-secondary mb-4" />,
            view: View.COMPARE,
        },
        {
            title: 'Stock Insights',
            description: 'Search for any stock to discover which mutual funds are currently holding it in their portfolio.',
            icon: <StockIcon className="w-12 h-12 text-secondary mb-4" />,
            view: View.STOCKS,
        },
        {
            title: 'Market Indices',
            description: 'Get a quick overview of the latest values and daily changes for major stock market indices.',
            icon: <IndexIcon className="w-12 h-12 text-secondary mb-4" />,
            view: View.INDICES,
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="text-center bg-gradient-to-br from-card to-background p-8 rounded-lg shadow-2xl mb-12 border border-border">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
                    Mutual Fund Overlap Analyzer
                </h1>
                <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                    Unlock powerful insights into fund portfolios. Compare funds, analyze stock holdings, and track market indices with our automated data platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featureCards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveView(card.view)}
                        className="bg-card rounded-lg p-6 flex flex-col items-center text-center border border-border
                                   transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group hover:border-secondary"
                    >
                        {card.icon}
                        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-secondary transition-colors duration-300">{card.title}</h3>
                        <p className="text-text-secondary">{card.description}</p>
                    </div>
                ))}
                 <div 
                    className="md:col-span-2 mt-8 bg-card p-6 rounded-lg border border-border transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group hover:border-primary"
                    onClick={() => setActiveView(View.ADMIN)}>
                    <div className="flex items-center">
                        <AdminIcon className="w-12 h-12 text-primary mr-6 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-text-primary mb-1 group-hover:text-primary transition-colors duration-300">Admin Panel</h3>
                            <p className="text-text-secondary">Manage data scraping bots, view execution logs, and monitor system status.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;