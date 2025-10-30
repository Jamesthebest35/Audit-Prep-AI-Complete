
import React, { useState, useMemo, useEffect } from 'react';
import type { AuditFinding } from '../../types';
import { FindingSeverity } from '../../types';

const severityConfig = {
    [FindingSeverity.Major]: { color: 'text-status-red', bg: 'bg-red-50', border: 'border-status-red', definition: 'Absence or total breakdown of a required process. Certification is at risk.' },
    [FindingSeverity.Minor]: { color: 'text-status-yellow', bg: 'bg-yellow-50', border: 'border-status-yellow', definition: 'Isolated lapse in following procedures. Must be corrected before next audit.' },
    [FindingSeverity.Observation]: { color: 'text-brand-light', bg: 'bg-blue-50', border: 'border-brand-light', definition: 'Opportunity for improvement. Recommended but not mandatory.' }
};

const statusConfig = {
    'Overdue': 'bg-status-red', 'At Risk': 'bg-status-yellow', 'On Track': 'bg-status-green',
};

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);


const FindingCard: React.FC<{ finding: AuditFinding, onEdit: () => void, onDelete: () => void }> = ({ finding, onEdit, onDelete }) => {
    const config = severityConfig[finding.severity];
    const statusColor = statusConfig[finding.status];
    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 transition hover:shadow-md ${config.border}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800 pr-4">{finding.issue}</p>
                    <p className="text-sm text-gray-500 mt-1">{finding.standard} / ID: {finding.id}</p>
                </div>
                <div className="flex items-center flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>{finding.severity}</span>
                    <button onClick={onEdit} className="ml-4 text-gray-400 hover:text-brand-primary"><EditIcon className="w-4 h-4"/></button>
                    <button onClick={onDelete} className="ml-2 text-gray-400 hover:text-status-red"><TrashIcon className="w-4 h-4"/></button>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-border flex justify-between items-center text-sm">
                <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Owner:</span>
                    <span className="font-semibold text-gray-700">{finding.owner}</span>
                </div>
                <div className="flex items-center">
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${statusColor}`}></span>
                    <span className="font-semibold text-gray-700">{finding.status}</span>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="text-gray-500">Due in {finding.due}</span>
                </div>
            </div>
        </div>
    );
}

const AddFindingModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (finding: AuditFinding) => void, findingToEdit: AuditFinding | null }> = ({ isOpen, onClose, onSave, findingToEdit }) => {
    const [finding, setFinding] = useState<Partial<AuditFinding>>(findingToEdit || {});

    useEffect(() => {
        setFinding(findingToEdit || { severity: FindingSeverity.Minor, status: 'On Track' });
    }, [findingToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFinding: AuditFinding = {
            id: finding.id || `NEW-${Date.now().toString().slice(-4)}`,
            ...finding,
        } as AuditFinding;
        onSave(newFinding);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFinding({ ...finding, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">{findingToEdit ? 'Edit Finding' : 'Add New Finding'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issue</label>
                        <input type="text" name="issue" value={finding.issue || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Severity</label>
                            <select name="severity" value={finding.severity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary">
                                {Object.values(FindingSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" value={finding.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary">
                                {['On Track', 'At Risk', 'Overdue'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Owner</label>
                            <input type="text" name="owner" value={finding.owner || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Due</label>
                            <input type="text" name="due" value={finding.due || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Standard</label>
                        <input type="text" name="standard" value={finding.standard || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" required />
                    </div>
                    <div className="pt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary">Save Finding</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface FindingsTrackerProps {
    findings: AuditFinding[];
    setFindings: React.Dispatch<React.SetStateAction<AuditFinding[]>>;
    searchQuery: string;
    initialFilter: FindingSeverity | null;
    clearInitialFilter: () => void;
}

export const FindingsTracker: React.FC<FindingsTrackerProps> = ({ findings, setFindings, searchQuery, initialFilter, clearInitialFilter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [findingToEdit, setFindingToEdit] = useState<AuditFinding | null>(null);

  useEffect(() => {
      return () => {
          clearInitialFilter();
      }
  }, [clearInitialFilter]);
  
  const filteredFindings = useMemo(() => {
    let results = findings;
    if(initialFilter) {
        results = results.filter(f => f.severity === initialFilter);
    }
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        results = results.filter(f =>
            f.issue.toLowerCase().includes(lowercasedQuery) ||
            f.id.toLowerCase().includes(lowercasedQuery) ||
            f.owner.toLowerCase().includes(lowercasedQuery) ||
            f.standard.toLowerCase().includes(lowercasedQuery)
        );
    }
    return results;
  }, [findings, searchQuery, initialFilter]);

  const handleSaveFinding = (finding: AuditFinding) => {
    if (findingToEdit) {
        setFindings(findings.map(f => f.id === finding.id ? finding : f));
    } else {
        setFindings([finding, ...findings]);
    }
    setIsModalOpen(false);
    setFindingToEdit(null);
  };
  
  const handleEdit = (finding: AuditFinding) => {
      setFindingToEdit(finding);
      setIsModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
      if(window.confirm('Are you sure you want to delete this finding?')) {
          setFindings(findings.filter(f => f.id !== id));
      }
  };

  return (
    <div className="space-y-8">
      <AddFindingModal 
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false); setFindingToEdit(null);}}
        onSave={handleSaveFinding}
        findingToEdit={findingToEdit}
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Severity Definitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(severityConfig).map(([severity, config]) => (
                <div key={severity} className={`p-4 rounded-lg border-l-4 ${config.bg} ${config.border}`}>
                    <h3 className={`font-bold ${config.color}`}>{severity}</h3>
                    <p className="text-sm text-gray-600 mt-1">{config.definition}</p>
                </div>
            ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">All Open Findings ({filteredFindings.length})</h3>
            <button onClick={() => {setFindingToEdit(null); setIsModalOpen(true);}} className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-secondary transition">
                + Add Finding
            </button>
        </div>
        <div className="space-y-4">
            {filteredFindings.length > 0 ? filteredFindings.map(finding => (
                <FindingCard key={finding.id} finding={finding} onEdit={() => handleEdit(finding)} onDelete={() => handleDelete(finding.id)} />
            )) : <p className="text-gray-500 text-center py-8">No findings match your criteria.</p>}
        </div>
      </div>
    </div>
  );
};
