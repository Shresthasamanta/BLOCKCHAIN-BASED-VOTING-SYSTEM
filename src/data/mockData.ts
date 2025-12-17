import { Election, User, Vote, VoteResult } from '@/types/election';

export const mockCandidates = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    position: 'CEO Candidate',
    bio: 'Former VP of Operations with 15 years of experience in scaling tech companies. Focused on sustainable growth and employee development.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    party: 'Growth Coalition',
  },
  {
    id: 'c2',
    name: 'Michael Roberts',
    position: 'CEO Candidate',
    bio: 'Founder of three successful startups. Passionate about innovation and building products that make a difference.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    party: 'Innovation First',
  },
  {
    id: 'c3',
    name: 'Emily Johnson',
    position: 'CEO Candidate',
    bio: 'CFO with expertise in financial strategy and international expansion. Committed to transparent leadership.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    party: 'Stability Alliance',
  },
];

export const mockBoardCandidates = [
  {
    id: 'b1',
    name: 'David Park',
    position: 'Board Member',
    bio: 'Technology advisor with expertise in AI and machine learning. Serves on multiple Fortune 500 boards.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: 'b2',
    name: 'Lisa Thompson',
    position: 'Board Member',
    bio: 'Former SEC commissioner with deep regulatory expertise. Advocate for corporate governance reform.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: 'b3',
    name: 'James Wilson',
    position: 'Board Member',
    bio: 'Investment banker specializing in M&A. Strong track record in value creation strategies.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    id: 'b4',
    name: 'Maria Garcia',
    position: 'Board Member',
    bio: 'Environmental sustainability expert. Leading voice in ESG integration and responsible investing.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  },
];

export const mockElections: Election[] = [
  {
    id: 'e1',
    title: '2024 CEO Election',
    description: 'Annual election for the position of Chief Executive Officer. All shareholders with voting rights are eligible to participate.',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-31'),
    candidates: mockCandidates,
    totalVotes: 1247,
    eligibleVoters: 2500,
    createdBy: 'admin',
  },
  {
    id: 'e2',
    title: 'Board of Directors Election',
    description: 'Election for 2 open seats on the Board of Directors. Select up to 2 candidates.',
    status: 'upcoming',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    candidates: mockBoardCandidates,
    totalVotes: 0,
    eligibleVoters: 2500,
    createdBy: 'admin',
  },
  {
    id: 'e3',
    title: 'Q3 Budget Proposal Vote',
    description: 'Vote on the proposed Q3 budget allocation including R&D expansion and new office facilities.',
    status: 'closed',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-15'),
    candidates: [
      { id: 'p1', name: 'Approve Budget', position: 'Yes', bio: 'Approve the proposed Q3 budget of $45M', photo: '' },
      { id: 'p2', name: 'Reject Budget', position: 'No', bio: 'Reject the proposal and request revision', photo: '' },
    ],
    totalVotes: 2134,
    eligibleVoters: 2500,
    createdBy: 'admin',
  },
];

export const mockVoteResults: Record<string, VoteResult[]> = {
  e1: [
    { candidateId: 'c1', candidateName: 'Sarah Chen', votes: 523, percentage: 42 },
    { candidateId: 'c2', candidateName: 'Michael Roberts', votes: 412, percentage: 33 },
    { candidateId: 'c3', candidateName: 'Emily Johnson', votes: 312, percentage: 25 },
  ],
  e3: [
    { candidateId: 'p1', candidateName: 'Approve Budget', votes: 1812, percentage: 85 },
    { candidateId: 'p2', candidateName: 'Reject Budget', votes: 322, percentage: 15 },
  ],
};

export const mockUser: User = {
  id: 'u1',
  email: 'john.smith@company.com',
  name: 'John Smith',
  role: 'voter',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE53',
  votedElections: ['e3'],
};

export const mockVotes: Vote[] = [
  {
    id: 'v1',
    electionId: 'e3',
    candidateId: 'p1',
    transactionHash: '0x8f7d3b2e1a4c5f6d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    timestamp: new Date('2024-07-10T14:32:00'),
    blockNumber: 18245678,
  },
];

export const generateTransactionHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const generateBlockNumber = (): number => {
  return 18245678 + Math.floor(Math.random() * 10000);
};
