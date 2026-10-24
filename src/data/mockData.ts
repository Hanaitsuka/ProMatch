export interface Project {
  id: string;
  title: string;
  summary: string;
  domain: string;
  skills: string[];
  matchedSkills?: string[];
  mode: 'Online' | 'Offline' | 'Hybrid';
  experience?: 'Beginner' | 'Intermediate' | 'Expert';
  weeklyHours: number;
  teamSize: number;
  teamFilled: number;
  creatorName: string;
  creatorDept: string;
  creatorSem: string;
  matchScore?: number;
  isReciprocal?: boolean;
  status?: 'active' | 'completed';
}

export interface Student {
  id: string;
  name: string;
  dept: string;
  classLabel: string;
  sem: string;
  skills: string[];
  weeklyHours: number;
  githubUrl: string;
  experience?: 'Beginner' | 'Intermediate' | 'Expert';
  mode?: 'Online' | 'Offline' | 'Hybrid';
  matchScore: number;
}

export interface Message {
  id: string;
  sender: string;
  senderSelf: boolean;
  text: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  type: 'project' | 'direct';
  title: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  participants?: string[];
  projectId?: string;
}

export const CURRENT_USER = {
  name: 'Hadiya Thanveer',
  dept: 'Computer Science & Engineering',
  deptShort: 'CSE',
  classLabel: 'B.Tech',
  sem: 'S6',
  skills: ['React', 'UI Design', 'Figma', 'TypeScript', 'Python'],
  weeklyHours: 10,
  githubUrl: 'https://github.com/hadiya-thanveer',
};

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Smart Campus IoT Monitoring System',
    summary: 'A distributed sensor network to monitor energy usage and environmental conditions across GEC campus buildings in real time.',
    domain: 'IoT',
    skills: ['Embedded C', 'MQTT', 'React', 'Node.js', 'PCB Design'],
    matchedSkills: ['React', 'Node.js'],
    mode: 'Hybrid',
    experience: 'Intermediate',
    weeklyHours: 8,
    teamSize: 5,
    teamFilled: 3,
    creatorName: 'Arun Krishnan',
    creatorDept: 'ECE',
    creatorSem: 'S6',
    matchScore: 92,
    isReciprocal: false,
  },
  {
    id: 'p2',
    title: 'AI-Powered Attendance System with Face Recognition',
    summary: 'Automated classroom attendance using computer vision and deep learning, integrated with the college ERP system.',
    domain: 'AI/ML',
    skills: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'SQL'],
    matchedSkills: ['Python'],
    mode: 'Offline',
    experience: 'Intermediate',
    weeklyHours: 6,
    teamSize: 4,
    teamFilled: 2,
    creatorName: 'Sreelakshmi Nair',
    creatorDept: 'CSE',
    creatorSem: 'S8',
    matchScore: 74,
    isReciprocal: true,
  },
  {
    id: 'p3',
    title: 'Decentralised Library Resource Exchange',
    summary: 'A peer-to-peer platform for GEC students to lend, borrow, and track academic resources using blockchain-backed records.',
    domain: 'Web Development',
    skills: ['React', 'TypeScript', 'Solidity', 'Node.js', 'MongoDB'],
    matchedSkills: ['React', 'TypeScript'],
    mode: 'Online',
    experience: 'Expert',
    weeklyHours: 10,
    teamSize: 4,
    teamFilled: 3,
    creatorName: 'Mohammed Anees',
    creatorDept: 'CSE',
    creatorSem: 'S6',
    matchScore: 88,
    isReciprocal: false,
  },
  {
    id: 'p4',
    title: 'Low-Power Embedded Weather Station',
    summary: 'A solar-powered, LoRa-enabled remote weather station for agricultural and environmental data collection in rural Kerala.',
    domain: 'Embedded',
    skills: ['Embedded C', 'LoRa', 'RTOS', 'KiCad', 'Python'],
    matchedSkills: [],
    mode: 'Hybrid',
    experience: 'Expert',
    weeklyHours: 12,
    teamSize: 3,
    teamFilled: 1,
    creatorName: 'Vishnu Prasad',
    creatorDept: 'ECE',
    creatorSem: 'S8',
    matchScore: 41,
    isReciprocal: true,
  },
  {
    id: 'p5',
    title: 'Structural Health Monitoring via Vibration Analysis',
    summary: 'Using accelerometer arrays and signal processing to detect early-stage micro-cracks in civil infrastructure.',
    domain: 'Systems',
    skills: ['MATLAB', 'Signal Processing', 'Python', 'LabVIEW', 'Data Analysis'],
    matchedSkills: ['Python'],
    mode: 'Offline',
    experience: 'Intermediate',
    weeklyHours: 6,
    teamSize: 5,
    teamFilled: 4,
    creatorName: 'Ananya Menon',
    creatorDept: 'CE',
    creatorSem: 'S8',
    matchScore: 56,
    isReciprocal: false,
  },
  {
    id: 'p6',
    title: 'Network Intrusion Detection with ML',
    summary: 'Applying machine learning classifiers to detect anomalous traffic patterns in campus LAN, with a real-time alert dashboard.',
    domain: 'Cybersecurity',
    skills: ['Python', 'Scikit-learn', 'React', 'Wireshark', 'SQL'],
    matchedSkills: ['Python', 'React'],
    mode: 'Online',
    experience: 'Intermediate',
    weeklyHours: 8,
    teamSize: 4,
    teamFilled: 2,
    creatorName: 'Fathima Rizma',
    creatorDept: 'CSE',
    creatorSem: 'S6',
    matchScore: 85,
    isReciprocal: false,
  },
];

export const MY_PROJECTS: (Project & { role: 'Owner' | 'Member' })[] = [
  {
    ...PROJECTS[2],
    role: 'Member',
    teamFilled: 3,
    status: 'active',
  },
  {
    id: 'my1',
    title: 'ProMatch — GEC Project Portal',
    summary: 'The very platform you\'re using. Building the frontend with React and Figma-based design system.',
    domain: 'Web Development',
    skills: ['React', 'TypeScript', 'Figma', 'UI Design'],
    matchedSkills: ['React', 'TypeScript'],
    mode: 'Hybrid',
    experience: 'Intermediate',
    weeklyHours: 8,
    teamSize: 5,
    teamFilled: 3,
    creatorName: 'Hadiya Thanveer',
    creatorDept: 'CSE',
    creatorSem: 'S6',
    matchScore: 100,
    isReciprocal: false,
    role: 'Owner',
    status: 'active',
  },
  {
    ...PROJECTS[5],
    role: 'Member',
    teamFilled: 2,
    status: 'active',
  },
];

export const STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Arjun Radhakrishnan',
    dept: 'CSE',
    classLabel: 'B.Tech',
    sem: 'S6',
    skills: ['Python', 'TensorFlow', 'Flask', 'SQL', 'Docker'],
    weeklyHours: 12,
    githubUrl: 'https://github.com/arjun-radhakrishnan',
    experience: 'Intermediate',
    mode: 'Online',
    matchScore: 94,
  },
  {
    id: 's2',
    name: 'Nithya Suresh',
    dept: 'ECE',
    classLabel: 'B.Tech',
    sem: 'S4',
    skills: ['Embedded C', 'VHDL', 'MATLAB', 'KiCad'],
    weeklyHours: 8,
    githubUrl: 'https://github.com/nithya-suresh',
    experience: 'Beginner',
    mode: 'Offline',
    matchScore: 82,
  },
  {
    id: 's3',
    name: 'Adithya Pillai',
    dept: 'CSE',
    classLabel: 'B.Tech',
    sem: 'S8',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'GraphQL'],
    weeklyHours: 15,
    githubUrl: 'https://github.com/adithya-pillai',
    experience: 'Expert',
    mode: 'Hybrid',
    matchScore: 91,
  },
  {
    id: 's4',
    name: 'Meera Gopinath',
    dept: 'CE',
    classLabel: 'B.Tech',
    sem: 'S6',
    skills: ['AutoCAD', 'STAAD Pro', 'MATLAB', 'Python'],
    weeklyHours: 6,
    githubUrl: 'https://github.com/meera-gopinath',
    experience: 'Intermediate',
    mode: 'Offline',
    matchScore: 76,
  },
  {
    id: 's5',
    name: 'Rahul Varma',
    dept: 'EEE',
    classLabel: 'B.Tech',
    sem: 'S4',
    skills: ['Power Electronics', 'MATLAB', 'Simulink', 'Embedded C'],
    weeklyHours: 10,
    githubUrl: 'https://github.com/rahul-varma',
    experience: 'Beginner',
    mode: 'Hybrid',
    matchScore: 73,
  },
  {
    id: 's6',
    name: 'Amitha Krishnakumar',
    dept: 'CSE',
    classLabel: 'B.Tech',
    sem: 'S6',
    skills: ['React', 'Figma', 'TypeScript', 'UI/UX', 'Next.js'],
    weeklyHours: 12,
    githubUrl: 'https://github.com/amitha-kk',
    experience: 'Intermediate',
    mode: 'Online',
    matchScore: 89,
  },
];

export const THREADS: Thread[] = [
  {
    id: 't1',
    type: 'project',
    title: 'ProMatch — GEC Portal',
    lastMessage: 'Hadiya: Updated the Figma prototype for the profile page',
    time: '10:42 AM',
    unread: true,
  },
  {
    id: 't2',
    type: 'project',
    title: 'Network Intrusion Detection',
    lastMessage: 'Fathima: Dataset preprocessing done. PR ready for review.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 't3',
    type: 'direct',
    title: 'Adithya Pillai',
    lastMessage: 'Sure, I can review the API contract tonight.',
    time: '9:15 AM',
    unread: true,
  },
  {
    id: 't4',
    type: 'direct',
    title: 'Sreelakshmi Nair',
    lastMessage: 'Can we sync tomorrow morning before class?',
    time: 'Tuesday',
    unread: false,
  },
];

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'Mohammed Anees',
    senderSelf: false,
    text: 'Hey everyone! Welcome to the ProMatch team workspace.',
    timestamp: '9:00 AM',
  },
  {
    id: 'm2',
    sender: 'Fathima Rizma',
    senderSelf: false,
    text: 'Thanks for the invite! Looking forward to building this together.',
    timestamp: '9:05 AM',
  },
  {
    id: 'm3',
    sender: 'Hadiya Thanveer',
    senderSelf: true,
    text: 'I\'ve pushed the initial Figma file. Components are organized by page.',
    timestamp: '9:18 AM',
  },
  {
    id: 'm4',
    sender: 'Mohammed Anees',
    senderSelf: false,
    text: 'Perfect. Let\'s divide the backend routes — auth, projects, and messaging.',
    timestamp: '9:22 AM',
  },
  {
    id: 'm5',
    sender: 'Hadiya Thanveer',
    senderSelf: true,
    text: 'Updated the Figma prototype for the profile page — the skill chip editor is now interactive.',
    timestamp: '10:42 AM',
  },
];

export const DOMAINS = ['AI/ML', 'Web Development', 'IoT', 'Systems', 'Embedded', 'Cybersecurity'];
export const DEPTS = ['CSE', 'ECE', 'EEE', 'ME', 'CE'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const MODES = ['Online', 'Offline', 'Hybrid'];
export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert'];
export const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

export const DEPT_FULL: Record<string, string> = {
  CSE: 'Computer Science & Engineering',
  ECE: 'Electronics & Communication Engineering',
  EEE: 'Electrical & Electronics Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
};
