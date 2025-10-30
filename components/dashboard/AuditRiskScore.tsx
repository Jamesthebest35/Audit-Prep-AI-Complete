import React from 'react';
import { Card } from '../shared/Card';
import { AlertTriangleIcon, CheckCircleIcon } from '../shared/Icon';

const factors = [
    { text: 'Document currency: 15% overdue', points: -12, isCritical: true },
    { text: 'Previous findings closure: 2 open CAPAs', points: -8, isCritical: true },
    { text: 'Recent changes: New ERP implementation', points: -10, isCritical: false },
    { text: 'Training completion: 92% vs 100% target', points: -5, isCritical: false },
];

export const AuditRiskScore: React.FC = () => {
    const score = 78;
    const circumference = 2 * Math.PI * 60; // larger radius
    const offset = circumference - (score / 100) * circumference;

  return (
    <Card title="Predictive Compliance Score" className="h-full">
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-shrink-0 relative mb-4 md:mb-0 md:mr-8">
                <svg className="w-48 h-48 transform -rotate-90">
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                    </defs>
                    <circle cx="96" cy="96" r="60" stroke="#E5E7EB" strokeWidth="14" fill="transparent" />
                    <circle
                        cx="96"
                        cy="96"
                        r="60"
                        stroke="url(#scoreGradient)"
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold text-status-yellow">{score}</span>
                    <span className="text-sm text-gray-500 font-semibold">/ 100</span>
                </div>
            </div>
            <div className="flex-1">
                <div className="bg-yellow-50 border-l-4 border-status-yellow text-status-yellow p-3 rounded-r-lg mb-4">
                    <h4 className="font-bold">RISK LEVEL: MEDIUM-HIGH</h4>
                    <p className="text-sm text-yellow-700">Focus on document updates and CAPA closure to improve score.</p>
                </div>
                
                <h5 className="font-semibold text-gray-700 mb-2">Key Risk Factors:</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                   {factors.map((factor, i) => (
                       <li key={i} className="flex items-center justify-between">
                           <div className="flex items-center">
                             {factor.isCritical ? 
                                <AlertTriangleIcon className="w-4 h-4 text-status-red mr-2 flex-shrink-0" /> : 
                                <CheckCircleIcon className="w-4 h-4 text-status-yellow mr-2 flex-shrink-0" />
                             }
                            <span>{factor.text}</span>
                           </div>
                           <span className={`font-bold ${factor.isCritical ? 'text-status-red' : 'text-status-yellow'}`}>{factor.points} pts</span>
                        </li>
                   ))}
                </ul>
            </div>
        </div>
    </Card>
  );
};