
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { BuildingOfficeIcon, UsersIcon, UserIcon, CheckCircleIcon } from '../shared/Icon';

const trainingPaths = [
    {
        id: 'c-suite',
        role: 'C-Suite Executives',
        icon: BuildingOfficeIcon,
        description: 'High-level training focused on governance, leadership, and strategic compliance alignment.',
        modules: [
            'Management Review Responsibilities',
            'Demonstrating Leadership Commitment',
            'Resource Allocation for QMS',
            'Understanding Audit Risk & Liability',
        ]
    },
    {
        id: 'process-owners',
        role: 'Process Owners & Dept. Heads',
        icon: UsersIcon,
        description: 'In-depth training on process management, documentation, and continuous improvement.',
        modules: [
            'KPI Definition and Monitoring',
            'Process Documentation & Control',
            'Root Cause Analysis & CAPA',
            'Continuous Improvement (PDCA)',
        ]
    },
    {
        id: 'front-line',
        role: 'Front-Line Employees',
        icon: UserIcon,
        description: 'Essential training on fundamental compliance duties and their role in a successful audit.',
        modules: [
            'Document Control Basics',
            'InfoSec & Data Privacy Awareness',
            'Incident Reporting Procedures',
            'Audit Interview Preparedness',
        ]
    }
];

export const TrainingPaths: React.FC = () => {
  const [assigned, setAssigned] = useState<string[]>([]);

  const handleAssign = (id: string) => {
      setAssigned(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {trainingPaths.map(path => {
        const isAssigned = assigned.includes(path.id);
        return (
            <Card key={path.role} title={path.role} icon={<path.icon className="w-5 h-5"/>} className="!p-0 flex flex-col h-full">
                <div className="p-5 flex-1">
                    <p className="text-sm text-gray-600 mb-5">{path.description}</p>
                    <h4 className="font-semibold text-sm text-gray-800 mb-3">Core Modules</h4>
                    <ul className="space-y-2.5">
                        {path.modules.map((module, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-700">
                                <CheckCircleIcon className="w-4 h-4 text-status-green mr-3 flex-shrink-0" />
                                <span>{module}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-light p-4 rounded-b-xl mt-2 border-t border-gray-border">
                    <button 
                        onClick={() => handleAssign(path.id)}
                        className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            isAssigned 
                                ? 'bg-status-green text-white' 
                                : 'bg-brand-primary text-white hover:bg-brand-secondary'
                        }`}
                    >
                        {isAssigned ? '✓ Assigned' : 'Assign Training'}
                    </button>
                </div>
            </Card>
        )
      })}
    </div>
  );
};
