import React from 'react';
import { Card } from '../shared/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangleIcon } from '../shared/Icon';

const data = [
  { name: 'Up-to-date', value: 142 },
  { name: 'Review needed', value: 45 },
  { name: 'Overdue', value: 21 },
];

const COLORS = ['#16A34A', '#F59E0B', '#DC2626'];

export const DocumentationHealth: React.FC = () => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  return (
    <Card title="Documentation Health" className="h-full">
      <div className="h-44 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${((value/total)*100).toFixed(0)}%`} />
            <Legend iconType="circle" iconSize={10} verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-dark">{total}</span>
          <span className="text-xs text-gray-medium">Total Documents</span>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-border pt-4">
        <h4 className="font-semibold text-gray-700 mb-3">Critical Gaps Identified:</h4>
        <ul className="space-y-2.5 text-sm">
          <li className="flex items-start text-red-700"><AlertTriangleIcon className="w-4 h-4 text-status-red mr-2 mt-0.5 flex-shrink-0"/>Missing Management Review Minutes (Q3) - ISO 9001</li>
          <li className="flex items-start text-red-700"><AlertTriangleIcon className="w-4 h-4 text-status-red mr-2 mt-0.5 flex-shrink-0"/>Vendor Risk Assessment for 3 suppliers - SOC 2</li>
          <li className="flex items-start text-red-700"><AlertTriangleIcon className="w-4 h-4 text-status-red mr-2 mt-0.5 flex-shrink-0"/>BCP test results not documented - ISO 27001</li>
        </ul>
      </div>
    </Card>
  );
};