
import React from 'react';
import { DocumentationHealth } from './DocumentationHealth';
import { AuditRiskScore } from './AuditRiskScore';
import { FindingsSummary } from './FindingsSummary';
import { QualityObjectives } from './QualityObjectives';
import type { AuditFinding, FindingSeverity } from '../../types';

interface DashboardProps {
    findings: AuditFinding[];
    onFilterSelect: (severity: FindingSeverity) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ findings, onFilterSelect }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <AuditRiskScore />
        </div>
        <DocumentationHealth />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
            <FindingsSummary findings={findings} onFilterSelect={onFilterSelect} />
        </div>
        <div className="lg:col-span-2">
            <QualityObjectives />
        </div>
      </div>
    </div>
  );
};
