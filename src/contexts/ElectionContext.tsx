import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Election, Vote, VoteResult } from '@/types/election';
import { mockElections, mockVotes, mockVoteResults, generateTransactionHash, generateBlockNumber } from '@/data/mockData';

interface ElectionContextType {
  elections: Election[];
  votes: Vote[];
  getElection: (id: string) => Election | undefined;
  getResults: (electionId: string) => VoteResult[];
  castVote: (electionId: string, candidateId: string) => Promise<Vote>;
  verifyVote: (transactionHash: string) => Promise<Vote | null>;
  createElection: (election: Omit<Election, 'id' | 'totalVotes'>) => Election;
  updateElectionStatus: (id: string, status: Election['status']) => void;
  hasVoted: (electionId: string) => boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider = ({ children }: { children: ReactNode }) => {
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [votes, setVotes] = useState<Vote[]>(mockVotes);
  const [votedElections, setVotedElections] = useState<string[]>(['e3']);

  const getElection = (id: string) => elections.find(e => e.id === id);

  const getResults = (electionId: string): VoteResult[] => {
    return mockVoteResults[electionId] || [];
  };

  const castVote = async (electionId: string, candidateId: string): Promise<Vote> => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const vote: Vote = {
      id: `v${votes.length + 1}`,
      electionId,
      candidateId,
      transactionHash: generateTransactionHash(),
      timestamp: new Date(),
      blockNumber: generateBlockNumber(),
    };

    setVotes(prev => [...prev, vote]);
    setVotedElections(prev => [...prev, electionId]);
    
    // Update election vote count
    setElections(prev => prev.map(e => 
      e.id === electionId ? { ...e, totalVotes: e.totalVotes + 1 } : e
    ));

    return vote;
  };

  const verifyVote = async (transactionHash: string): Promise<Vote | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return votes.find(v => v.transactionHash === transactionHash) || null;
  };

  const createElection = (electionData: Omit<Election, 'id' | 'totalVotes'>): Election => {
    const newElection: Election = {
      ...electionData,
      id: `e${elections.length + 1}`,
      totalVotes: 0,
    };
    setElections(prev => [...prev, newElection]);
    return newElection;
  };

  const updateElectionStatus = (id: string, status: Election['status']) => {
    setElections(prev => prev.map(e => 
      e.id === id ? { ...e, status } : e
    ));
  };

  const hasVoted = (electionId: string) => votedElections.includes(electionId);

  return (
    <ElectionContext.Provider value={{
      elections,
      votes,
      getElection,
      getResults,
      castVote,
      verifyVote,
      createElection,
      updateElectionStatus,
      hasVoted,
    }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElections = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElections must be used within an ElectionProvider');
  }
  return context;
};
