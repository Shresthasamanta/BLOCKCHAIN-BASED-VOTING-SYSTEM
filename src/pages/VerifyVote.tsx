import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useElections } from '@/contexts/ElectionContext';
import { 
  Search, CheckCircle, XCircle, Loader2, Shield, 
  Blocks, Clock, ExternalLink, Copy
} from 'lucide-react';

const VerifyVote = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { verifyVote, elections } = useElections();
  
  const [hash, setHash] = useState(searchParams.get('hash') || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'not-found' | null>(null);
  const [voteDetails, setVoteDetails] = useState<{
    electionTitle: string;
    timestamp: Date;
    blockNumber: number;
  } | null>(null);

  const handleVerify = async () => {
    if (!hash.trim()) {
      toast({ title: 'Error', description: 'Please enter a transaction hash', variant: 'destructive' });
      return;
    }

    setIsVerifying(true);
    try {
      const vote = await verifyVote(hash.trim());
      if (vote) {
        const election = elections.find(e => e.id === vote.electionId);
        setVoteDetails({
          electionTitle: election?.title || 'Unknown Election',
          timestamp: vote.timestamp,
          blockNumber: vote.blockNumber,
        });
        setVerificationResult('success');
      } else {
        setVerificationResult('not-found');
        setVoteDetails(null);
      }
    } catch (error) {
      setVerificationResult('not-found');
      setVoteDetails(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Transaction hash copied to clipboard.' });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Verify Your Vote</h1>
        <p className="text-lg text-muted-foreground">
          Enter your transaction hash to verify your vote was recorded on the blockchain
        </p>
      </div>

      {/* Search Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="Enter transaction hash (0x...)"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button onClick={handleVerify} disabled={isVerifying} className="gap-2 flex-shrink-0">
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult === 'success' && voteDetails && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-success">Vote Verified</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your vote was successfully recorded on the blockchain
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Blocks className="w-4 h-4" />
                  Election
                </div>
                <span className="font-medium text-foreground">{voteDetails.electionTitle}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Timestamp
                </div>
                <span className="font-medium text-foreground">
                  {voteDetails.timestamp.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Blocks className="w-4 h-4" />
                  Block Number
                </div>
                <span className="font-mono font-medium text-foreground">
                  #{voteDetails.blockNumber.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-foreground break-all flex-1">
                  {hash}
                </code>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="flex-shrink-0"
                  onClick={() => copyToClipboard(hash)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              View on Blockchain Explorer (Demo)
            </Button>
          </CardContent>
        </Card>
      )}

      {verificationResult === 'not-found' && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive">Vote Not Found</CardTitle>
                <p className="text-sm text-muted-foreground">
                  No vote was found with this transaction hash
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Please check the transaction hash and try again. If you believe this is an error, 
              please contact support.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">How Vote Verification Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Enter Your Transaction Hash</p>
              <p className="text-sm text-muted-foreground">
                When you cast a vote, you receive a unique transaction hash as proof of your vote.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Blockchain Verification</p>
              <p className="text-sm text-muted-foreground">
                We check the blockchain to confirm your vote was recorded and hasn't been tampered with.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Privacy Protected</p>
              <p className="text-sm text-muted-foreground">
                Your vote choice remains private. Only the fact that you voted is verifiable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyVote;
