import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const DashboardIcon = (props: IconProps) => <IconBase {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></IconBase>;
export const SearchIcon = (props: IconProps) => <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconBase>;
export const UsersIcon = (props: IconProps) => <IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>;
export const MessageIcon = (props: IconProps) => <IconBase {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></IconBase>;
export const UserIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></IconBase>;
export const LogOutIcon = (props: IconProps) => <IconBase {...props}><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" /></IconBase>;
export const BellIcon = (props: IconProps) => <IconBase {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></IconBase>;
export const PencilIcon = (props: IconProps) => <IconBase {...props}><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10zM14 7l3 3" /></IconBase>;
export const GithubIcon = (props: IconProps) => <IconBase {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4M8 19c-3 .9-3-1.5-4-2" /></IconBase>;
export const ClockIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></IconBase>;
export const GlobeIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></IconBase>;
export const BuildingIcon = (props: IconProps) => <IconBase {...props}><path d="M4 21V5l8-3 8 3v16M2 21h20M8 9h1M15 9h1M8 13h1M15 13h1M10 21v-4h4v4" /></IconBase>;
export const HybridIcon = (props: IconProps) => <IconBase {...props}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></IconBase>;
export const FigmaIcon = (props: IconProps) => <IconBase {...props}><path d="M8 2h4v8H8a4 4 0 0 1 0-8zM12 2h4a4 4 0 0 1 0 8h-4zM8 10h4v8H8a4 4 0 0 1 0-8zM12 10h4a4 4 0 1 1-4 4zM8 18h4v2a4 4 0 1 1-4-2z" /></IconBase>;
export const DocumentIcon = (props: IconProps) => <IconBase {...props}><path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6" /></IconBase>;
export const NoteIcon = (props: IconProps) => <IconBase {...props}><path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5" /></IconBase>;
export const ExternalLinkIcon = (props: IconProps) => <IconBase {...props}><path d="M14 3h7v7M10 14 21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" /></IconBase>;
export const PaperclipIcon = (props: IconProps) => <IconBase {...props}><path d="m21 11-8.5 8.5a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.8-2.8l8.5-8.5" /></IconBase>;
export const SendIcon = (props: IconProps) => <IconBase {...props}><path d="m22 2-7 20-4-9-9-4zM22 2 11 13" /></IconBase>;
export const CheckIcon = (props: IconProps) => <IconBase {...props}><path d="m5 12 4 4L19 6" /></IconBase>;
export const GraduationCapIcon = (props: IconProps) => <IconBase {...props}><path d="m2 10 10-5 10 5-10 5zM6 12v5c3 2 9 2 12 0v-5M22 10v6" /></IconBase>;
export const ClipboardIcon = (props: IconProps) => <IconBase {...props}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 10h6M9 14h6" /></IconBase>;
export const PuzzleIcon = (props: IconProps) => <IconBase {...props}><path d="M19 13h-2.2a2.5 2.5 0 1 1 0-2H19V5h-6V2.8a2.5 2.5 0 1 0-2 0V5H5v6h2.2a2.5 2.5 0 1 1 0 2H5v6h6v-2.2a2.5 2.5 0 1 1 2 0V19h6z" /></IconBase>;
export const LockIcon = (props: IconProps) => <IconBase {...props}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></IconBase>;
