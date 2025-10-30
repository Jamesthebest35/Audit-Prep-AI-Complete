
import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { AuditSimulation } from './components/audit-simulation/AuditSimulation';
import { FindingsTracker } from './components/findings/FindingsTracker';
import { TrainingPaths } from './components/training/TrainingPaths';
import { ExpertAgent } from './components/agent/ExpertAgent';
import type { ViewType, AuditFinding } from './types';
import { FindingSeverity } from './types';

const initialFindings: AuditFinding[] = [
  { id: 'ISO-2024-MAJ-01', severity: FindingSeverity.Major, issue: 'No evidence of management review for Q3', due: '15 days', status: 'Overdue', owner: 'CFO', standard: 'ISO 9001' },
  { id: 'SOC2-2024-MAJ-03', severity: FindingSeverity.Major, issue: '45-day gap in vulnerability scanning', due: '8 days', status: 'At Risk', owner: 'CISO', standard: 'SOC 2' },
  { id: 'ISO-2024-MIN-02', severity: FindingSeverity.Minor, issue: '3 of 25 training records lack completion dates', due: '30 days', status: 'On Track', owner: 'HR Manager', standard: 'ISO 9001' },
  { id: 'PCIDSS-2024-MIN-01', severity: FindingSeverity.Minor, issue: 'Firewall rule review is 1 week overdue', due: '22 days', status: 'On Track', owner: 'Network Admin', standard: 'PCI DSS v4.0' },
  { id: 'ISO-2024-OBS-01', severity: FindingSeverity.Observation, issue: 'Consider automating document version control for policies', due: 'N/A', status: 'On Track', owner: 'IT Director', standard: 'ISO 27001' },
];


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [findings, setFindings] = useState<AuditFinding[]>(initialFindings);
  const [searchQuery, setSearchQuery] = useState('');
  const [findingsFilter, setFindingsFilter] = useState<FindingSeverity | null>(null);

  const handleSetFilterAndNavigate = (severity: FindingSeverity) => {
    setFindingsFilter(severity);
    setCurrentView('findings');
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onFilterSelect={handleSetFilterAndNavigate} />;
      case 'simulation':
        return <AuditSimulation />;
      case 'agent':
        return <ExpertAgent />;
      case 'findings':
        return <FindingsTracker 
            findings={findings}
            setFindings={setFindings}
            searchQuery={searchQuery}
            initialFilter={findingsFilter}
            clearInitialFilter={() => setFindingsFilter(null)}
        />;
      case 'training':
        return <TrainingPaths />;
      default:
        return <Dashboard onFilterSelect={handleSetFilterAndNavigate}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-light font-sans text-gray-dark">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            currentView={currentView} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-light p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;