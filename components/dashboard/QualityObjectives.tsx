import React from 'react';
import { Card } from '../shared/Card';
import { TargetIcon } from '../shared/Icon';

const objectives = [
  { title: 'Customer Satisfaction ≥95%', status: 'At Risk', value: 93.2, target: 95, color: 'yellow' },
  { title: 'On-Time Delivery ≥98%', status: 'On Track', value: 98.7, target: 98, color: 'green' },
  { title: 'First Pass Yield ≥99%', status: 'Not Met', value: 97.1, target: 99, color: 'red' },
];

const statusStyles = {
    green: { bg: 'bg-green-100', text: 'text-status-green', progress: 'bg-status-green' },
    yellow: { bg: 'bg-yellow-100', text: 'text-status-yellow', progress: 'bg-status-yellow' },
    red: { bg: 'bg-red-100', text: 'text-status-red', progress: 'bg-status-red' },
};

export const QualityObjectives: React.FC = () => {
  return (
    <Card title="Q4 Quality Objectives" icon={<TargetIcon/>}>
      <div className="space-y-5">
        {objectives.map((obj, index) => {
            const styles = statusStyles[obj.color as keyof typeof statusStyles];
            const progressPercentage = (obj.value / obj.target) * 100;
            return (
                <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-gray-800">{obj.title}</p>
                        <span className={`text-lg font-bold ${styles.text}`}>{obj.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${styles.progress} h-2 rounded-full`} style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                    </div>
                     <div className="text-right mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
                            {obj.status}
                        </span>
                    </div>
                </div>
            );
        })}
      </div>
    </Card>
  );
};