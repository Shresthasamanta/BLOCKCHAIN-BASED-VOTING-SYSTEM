import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useElections } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Vote, Clock, Users, CheckCircle, ArrowLeft, User,
  Shield, Loader2, ExternalLink, Copy, AlertCircle
} from 'lucide-react';
import { Candidate } from '@/types/election';

const VotingBooth = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getElection, castVote, hasVoted } = useElections();
  const { isAuthenticated, walletConnected } = useAuth();
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);

  const election = getElection(id || '');
  const alreadyVoted = hasVoted(id || '');

  if (!election) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Election Not Found</h1>
        <Button onClick={() => navigate('/elections')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Elections
        </Button>
      </div>
    );
  }

  const daysRemaining = Math.ceil((election.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const participation = Math.round((election.totalVotes / election.eligibleVoters) * 100);

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    try {
      const vote = await castVote(election.id, selectedCandidate.id);
      setTransactionHash(vote.transactionHash);
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
      toast({ title: 'Vote Cast Successfully!', description: 'Your vote has been recorded on the blockchain.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cast vote. Please try again.', variant: 'destructive' });
    } finally {
      setIsVoting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Transaction hash copied to clipboard.' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <Button variant="ghost" onClick={() => navigate('/elections')} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Elections
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={election.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                {election.status === 'active' ? 'Voting Open' : election.status}
              </Badge>
              {alreadyVoted && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  You've Voted
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{election.title}</h1>
            <p className="text-lg text-muted-foreground">{election.description}</p>
          </div>

          {/* Candidate Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Select a Candidate</h2>
            <div className="grid gap-4">
              {election.candidates.map((candidate) => (
                <Card 
                  key={candidate.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCandidate?.id === candidate.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  } ${alreadyVoted ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={() => !alreadyVoted && setSelectedCandidate(candidate)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Selection Indicator */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        selectedCandidate?.id === candidate.id 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground/30'
                      }`}>
                        {selectedCandidate?.id === candidate.id && (
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>

                      {/* Avatar */}
                      {candidate.photo ? (
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
                          {candidate.party && (
                            <Badge variant="outline" className="text-xs">{candidate.party}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{candidate.position}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{candidate.bio}</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingCandidate(candidate);
                            setShowCandidateModal(true);
                          }}
                        >
                          View full profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          {!alreadyVoted && (
            <div className="mt-8">
              {!isAuthenticated ? (
                <Button 
                  size="lg" 
                  className="w-full md:w-auto"
                  onClick={() => navigate('/auth')}
                >
                  Sign In to Vote
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full md:w-auto gap-2"
                  disabled={!selectedCandidate || election.status !== 'active'}
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <Vote className="w-5 h-5" />
                  Cast Your Vote
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Election Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Election Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time Remaining</span>
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-primary" />
                  {daysRemaining > 0 ? `${daysRemaining} days` : 'Ends today'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Candidates</span>
                <div className="flex items-center gap-2 font-medium">
                  <Users className="w-4 h-4 text-primary" />
                  {election.candidates.length}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Participation</span>
                  <span className="font-medium">{participation}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-primary rounded-full"
                    style={{ width: `${participation}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {election.totalVotes.toLocaleString()} of {election.eligibleVoters.toLocaleString()} voted
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Secure Voting</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your vote is encrypted and recorded on the blockchain. 
                    You will receive a transaction hash to verify your vote.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallet Status</span>
                {walletConnected ? (
                  <Badge className="bg-success/10 text-success">
                    <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Not Connected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Confirm Your Vote
            </DialogTitle>
            <DialogDescription>
              Please review your selection carefully. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {selectedCandidate.photo ? (
                    <img 
                      src={selectedCandidate.photo} 
                      alt={selectedCandidate.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{selectedCandidate.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isVoting}>
              Cancel
            </Button>
            <Button onClick={handleVoteSubmit} disabled={isVoting} className="gap-2">
              {isVoting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4" />
                  Confirm Vote
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center">Vote Cast Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your vote has been securely recorded on the blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted rounded-lg p-4 my-4">
            <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-foreground break-all flex-1">
                {transactionHash}
              </code>
              <Button 
                size="icon" 
                variant="ghost" 
                className="flex-shrink-0"
                onClick={() => copyToClipboard(transactionHash)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              className="gap-2"
              onClick={() => navigate(`/verify?hash=${transactionHash}`)}
            >
              <ExternalLink className="w-4 h-4" />
              Verify Your Vote
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Details Modal */}
      <Dialog open={showCandidateModal} onOpenChange={setShowCandidateModal}>
        <DialogContent>
          {viewingCandidate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  {viewingCandidate.photo ? (
                    <img 
                      src={viewingCandidate.photo} 
                      alt={viewingCandidate.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <DialogTitle>{viewingCandidate.name}</DialogTitle>
                    <p className="text-muted-foreground">{viewingCandidate.position}</p>
                    {viewingCandidate.party && (
                      <Badge variant="outline" className="mt-2">{viewingCandidate.party}</Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-2">About</h4>
                <p className="text-muted-foreground">{viewingCandidate.bio}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VotingBooth;
