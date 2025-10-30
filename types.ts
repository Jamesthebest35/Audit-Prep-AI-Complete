export type ViewType = 'dashboard' | 'simulation' | 'findings' | 'training' | 'agent';

export interface ChatMessage {
  sender: 'user' | 'astra';
  content: string;
}

export enum FindingSeverity {
  Major = 'Major Non-Conformity',
  Minor = 'Minor Non-Conformity',
  Observation = 'Observation',
}

export interface AuditFinding {
  id: string;
  severity: FindingSeverity;
  issue: string;
  due: string;
  status: 'On Track' | 'At Risk' | 'Overdue';
  owner: string;
  standard: string;
}

export interface Notification {
    id: number;
    text: string;
    time: string;
}