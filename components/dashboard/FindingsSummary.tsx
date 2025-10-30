
import React from 'react';
import { Card } from '../shared/Card';
import { FileWarningIcon, AlertTriangleIcon } from '../shared/Icon';
import { FindingSeverity } from '../../types';

const criticalFindings = [
  { id: 'MAJ-01', issue: 'No evidence of Q3 management review', owner: 'CFO', standard: 'ISO 9001' },
  { id: 'MAJ-03', issue: '45-day gap in vulnerability scanning', owner: 'CISO', standard: 'SOC 2' },
];

interface StatCardProps {
    count: number;
    label: string;
    color: string;
    onClick?: () => void;
}
const StatCard: React.FC<StatCardProps> = ({count, label, color, onClick}) => (
    <div className={`text-center p-2 rounded-lg ${onClick ? 'cursor-pointer hover:bg-gray-100' : ''}`} onClick={onClick}>
        <p className={`text-4xl font-extrabold ${color}`}>{count}</p>
        <p className="text-sm text-gray-medium font-semibold">{label}</p>
    </div>
);

interface FindingsSummaryProps {
    onFilterSelect: (severity: FindingSeverity) => void;
}

export const FindingsSummary: React.FC<FindingsSummaryProps> = ({ onFilterSelect }) => {
  return (
    <Card title="Open Audit Findings" icon={<FileWarningIcon/>}>
      <div className="flex justify-around items-center mb-5 pb-5 border-b border-gray-border">
        <StatCard count={2} label="Major NCRs" color="text-status-red" onClick={() => onFilterSelect(FindingSeverity.Major)} />
        <StatCard count={2} label="Minor NCRs" color="text-status-yellow" onClick={() => onFilterSelect(FindingSeverity.Minor)} />
        <StatCard count={1} label="Observations" color="text-brand-light" onClick={() => onFilterSelect(FindingSeverity.Observation)} />
      </div>
      <h4 className="font-semibold text-gray-700 mb-3">Immediate Action Required:</h4>
      <ul className="space-y-3">
        {criticalFindings.map(finding => (
          <li key={finding.id} className="flex items-start p-3 bg-red-50 rounded-lg">
            <AlertTriangleIcon className="w-5 h-5 text-status-red mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 leading-tight">{finding.issue}</p>
              <p className="text-xs text-gray-500">{finding.standard} &bull; Owner: {finding.owner}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
