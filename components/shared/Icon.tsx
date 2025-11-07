import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

export const Icon: React.FC<IconProps> = ({ children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
  </Icon>
);

export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </Icon>
);

export const FileWarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </Icon>
);

export const GraduationCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </Icon>
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="M22 2 11 13"/>
    </Icon>
);

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/>
        <path d="M20 14h2"/>
        <path d="M15 13v2"/>
        <path d="M9 13v2"/>
    </Icon>
);

export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </Icon>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </Icon>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </Icon>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </Icon>
);

export const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </Icon>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </Icon>
);

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
    </Icon>
);

export const BuildingOfficeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M9 18v-5.52a.48.48 0 0 1 .48-.48h5.04a.48.48 0 0 1 .48.48V18" />
        <path d="M4 21V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11" />
        <path d="M10 3v5" />
        <path d="M14 3v5" />
        <path d="M4 21h16" />
        <path d="M3 18h18" />
    </Icon>
);

// Fix: Corrected closing tag for UsersIcon from </I> to </Icon>.
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
);

// Fix: Add missing icons
export const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </Icon>
);

export const ZapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Icon>
);

export const BarChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </Icon>
);

export const BrainCircuitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M12 2a10 10 0 1 0 10 10c-1.8 0-3.42-.5-4.83-1.34" />
        <path d="M12 2a10 10 0 0 0-10 10c0 1.8.5 3.42 1.34 4.83" />
        <path d="M12 12a4 4 0 1 0 4 4" />
        <path d="M12 12a4 4 0 0 0-4-4" />
        <path d="M20 12a8 8 0 1 0-8-8" />
        <path d="M4 12a8 8 0 0 1 8 8" />
        <path d="m14 6-2-2-2 2" />
        <path d="m10 18 2 2 2-2" />
        <path d="m6 10-2 2 2 2" />
        <path d="m18 14 2-2-2-2" />
    </Icon>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
);

export const StarSolidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon fill="currentColor" stroke="none" {...props}>
        <polygon points="12 3 14.89 8.62 21 9.64 16.5 13.97 17.64 20.02 12 17.27 6.36 20.02 7.5 13.97 3 9.64 9.11 8.62 12 3" />
    </Icon>
);

export const StarOutlineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <polygon points="12 3 14.89 8.62 21 9.64 16.5 13.97 17.64 20.02 12 17.27 6.36 20.02 7.5 13.97 3 9.64 9.11 8.62 12 3" fill="none" />
    </Icon>
);

export const PinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M16 3a4 4 0 0 1 4 4v1a2 2 0 0 1-.68 1.5L18 11v2l1 2H5l1-2v-2l-1.32-1.5A2 2 0 0 1 4 8V7a4 4 0 0 1 4-4z" />
        <path d="M12 21v-6" />
    </Icon>
);

export const ArchiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <rect width="20" height="5" x="2" y="3" rx="1" />
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
        <path d="M10 12h4" />
    </Icon>
);

export const NotebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M4 4h12a2 2 0 0 1 2 2v14H4z" />
        <path d="M4 8h16" />
        <path d="M8 4v16" />
    </Icon>
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </Icon>
);

export const StackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="m12 2 9 4-9 4-9-4 9-4z" />
        <path d="m3 10 9 4 9-4" />
        <path d="m3 18 9 4 9-4" />
    </Icon>
);

export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M2 10V2h8l12 12-8 8L2 10z" />
        <path d="M7 7h.01" />
    </Icon>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </Icon>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
);
