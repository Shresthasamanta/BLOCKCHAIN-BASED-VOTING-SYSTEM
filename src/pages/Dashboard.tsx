import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useElections } from '@/contexts/ElectionContext';
import { 
  Vote, CheckCircle, Clock, ArrowRight, User, Wallet,
  History, Shield, ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const { user, walletConnected, connectWallet } = useAuth();
  const { elections, votes, hasVoted } = useElections();

  const eligibleElections = elections.filter(e => e.status === 'active');
  const userVotes = votes.filter(v => true); // In real app, filter by user
  const upcomingElections = elections.filter(e => e.status === 'upcoming');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voter Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Voter'}</p>
        </div>
        
        {!walletConnected ? (
          <Button onClick={connectWallet} variant="outline" className="gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Wallet Connected</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Vote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{eligibleElections.length}</p>
                <p className="text-sm text-muted-foreground">Active Elections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userVotes.length}</p>
                <p className="text-sm text-muted-foreground">Votes Cast</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingElections.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Verified</p>
                <p className="text-sm text-muted-foreground">Account Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Eligible Elections */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-primary" />
                Eligible Elections
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eligibleElections.length > 0 ? (
                <div className="space-y-4">
                  {eligibleElections.map((election) => {
                    const voted = hasVoted(election.id);
                    return (
                      <div 
                        key={election.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{election.title}</h3>
                            {voted && (
                              <Badge variant="secondary" className="bg-success/10 text-success">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Voted
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ends {election.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Link to={`/elections/${election.id}`}>
                          <Button size="sm" variant={voted ? 'outline' : 'default'} className="gap-1">
                            {voted ? 'View' : 'Vote'}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active elections at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user?.email || 'voter@company.com'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="secondary" className="capitalize">{user?.role || 'Voter'}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Voter ID</p>
                <p className="font-mono text-sm text-foreground">
                  ••••••{user?.id?.slice(-6) || '••••u1'}
                </p>
              </div>
              {user?.walletAddress && (
                <div>
                  <p className="text-sm text-muted-foreground">Wallet</p>
                  <p className="font-mono text-sm text-foreground">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vote History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="w-5 h-5" />
                Vote History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userVotes.length > 0 ? (
                <div className="space-y-3">
                  {userVotes.map((vote) => (
                    <div key={vote.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">
                          {elections.find(e => e.id === vote.electionId)?.title || 'Election'}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Block #{vote.blockNumber}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-muted-foreground font-mono truncate flex-1">
                          {vote.transactionHash.slice(0, 20)}...
                        </code>
                        <Link to={`/verify?hash=${vote.transactionHash}`}>
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No voting history yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
