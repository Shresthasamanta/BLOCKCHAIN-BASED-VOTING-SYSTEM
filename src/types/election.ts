export type ElectionStatus = 'draft' | 'upcoming' | 'active' | 'closed';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  party?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  status: ElectionStatus;
  startDate: Date;
  endDate: Date;
  candidates: Candidate[];
  totalVotes: number;
  eligibleVoters: number;
  createdBy: string;
}

export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  transactionHash: string;
  timestamp: Date;
  blockNumber: number;
}

export interface VoteResult {
  candidateId: string;
  candidateName: string;
  votes: number;
  percentage: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'voter' | 'admin' | 'observer';
  walletAddress?: string;
  votedElections: string[];
}
