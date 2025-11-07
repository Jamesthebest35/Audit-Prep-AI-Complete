
import React, { useMemo } from 'react';
import { Card } from '../shared/Card';
import { FileWarningIcon, AlertTriangleIcon } from '../shared/Icon';
import type { AuditFinding } from '../../types';
import { FindingSeverity } from '../../types';

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

const severityCards = [
    { severity: FindingSeverity.Major, label: 'Major NCRs', color: 'text-status-red' },
    { severity: FindingSeverity.Minor, label: 'Minor NCRs', color: 'text-status-yellow' },
    { severity: FindingSeverity.Observation, label: 'Observations', color: 'text-brand-light' },
];

interface FindingsSummaryProps {
    findings: AuditFinding[];
    onFilterSelect: (severity: FindingSeverity) => void;
}

export const FindingsSummary: React.FC<FindingsSummaryProps> = ({ findings, onFilterSelect }) => {
    const counts = useMemo(() => {
        const initialCounts: Record<FindingSeverity, number> = {
            [FindingSeverity.Major]: 0,
            [FindingSeverity.Minor]: 0,
            [FindingSeverity.Observation]: 0,
        };
        findings.forEach(finding => {
            initialCounts[finding.severity] = (initialCounts[finding.severity] ?? 0) + 1;
        });
        return initialCounts;
    }, [findings]);

    const criticalFindings = useMemo(() => {
        const priorityScore = (finding: AuditFinding) => {
            const severityScore =
                finding.severity === FindingSeverity.Major ? 2 : finding.severity === FindingSeverity.Minor ? 1 : 0;
            const statusScore = finding.status === 'Overdue' ? 2 : finding.status === 'At Risk' ? 1 : 0;
            return statusScore * 10 + severityScore;
        };

        return findings
            .filter(finding => finding.severity === FindingSeverity.Major || finding.status !== 'On Track')
            .sort((a, b) => priorityScore(b) - priorityScore(a))
            .slice(0, 3);
    }, [findings]);

  return (
    <Card title="Open Audit Findings" icon={<FileWarningIcon/>}>
      <div className="flex justify-around items-center mb-5 pb-5 border-b border-gray-border">
        {severityCards.map(card => (
            <StatCard
                key={card.severity}
                count={counts[card.severity] ?? 0}
                label={card.label}
                color={card.color}
                onClick={() => onFilterSelect(card.severity)}
            />
        ))}
      </div>
      <h4 className="font-semibold text-gray-700 mb-3">Immediate Action Required:</h4>
      {criticalFindings.length > 0 ? (
          <ul className="space-y-3">
              {criticalFindings.map(finding => (
                  <li key={finding.id} className="flex items-start p-3 bg-red-50 rounded-lg">
                      <AlertTriangleIcon className="w-5 h-5 text-status-red mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                          <p className="font-semibold text-gray-800 leading-tight">{finding.issue}</p>
                          <p className="text-xs text-gray-500">
                              {finding.standard} &bull; Owner: {finding.owner} &bull; Due: {finding.due}
                          </p>
                      </div>
                  </li>
              ))}
          </ul>
      ) : (
          <p className="text-sm text-gray-500 bg-gray-light border border-gray-border rounded-lg p-4">
              Great news — no critical findings need immediate action right now.
          </p>
      )}
    </Card>
  );
};
