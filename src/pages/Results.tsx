import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useElections } from '@/contexts/ElectionContext';
import { 
  BarChart3, Users, CheckCircle, ArrowLeft, Trophy,
  TrendingUp, Clock, PieChart
} from 'lucide-react';
import AnimatedResultsChart from '@/components/AnimatedResultsChart';
import CountdownTimer from '@/components/CountdownTimer';

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const { elections, getResults } = useElections();
  
  // If no ID, show all results
  const election = id ? elections.find(e => e.id === id) : null;
  const closedElections = elections.filter(e => e.status === 'closed' || e.totalVotes > 0);

  if (id && !election) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Election Not Found</h1>
        <Link to="/results">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            View All Results
          </Button>
        </Link>
      </div>
    );
  }

  // Single election results
  if (election) {
    const results = getResults(election.id);
    const winner = results.length > 0 ? results.reduce((a, b) => a.votes > b.votes ? a : b) : null;
    const participation = Math.round((election.totalVotes / election.eligibleVoters) * 100);

    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/results">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            All Results
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={election.status === 'closed' ? 'bg-muted text-muted-foreground' : 'bg-success text-success-foreground'}>
              {election.status === 'closed' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Results Certified
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live Results
                </>
              )}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{election.title}</h1>
          <p className="text-lg text-muted-foreground">{election.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{election.totalVotes.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{participation}%</p>
                  <p className="text-sm text-muted-foreground">Participation Rate</p>
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
                  <p className="text-2xl font-bold text-foreground">
                    {election.status === 'closed' ? 'Ended' : 'Active'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {election.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Countdown for Active Elections */}
        {election.status === 'active' && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <CountdownTimer targetDate={election.endDate} label="Voting ends in" />
            </CardContent>
          </Card>
        )}

        {/* Results Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Vote Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatedResultsChart 
              results={results} 
              totalVotes={election.totalVotes}
              candidates={election.candidates}
            />
          </CardContent>
        </Card>

        {/* Winner Card */}
        {winner && election.status === 'closed' && (
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Winner</p>
                  <h3 className="text-2xl font-bold text-foreground">{winner.candidateName}</h3>
                  <p className="text-muted-foreground">
                    {winner.votes.toLocaleString()} votes ({winner.percentage}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // All results view
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Election Results</h1>
        <p className="text-lg text-muted-foreground">View results from completed and ongoing elections</p>
      </div>

      {closedElections.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closedElections.map((election) => {
            const results = getResults(election.id);
            const winner = results.length > 0 ? results.reduce((a, b) => a.votes > b.votes ? a : b) : null;
            const participation = Math.round((election.totalVotes / election.eligibleVoters) * 100);

            return (
              <Card key={election.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={election.status === 'closed' ? 'bg-muted text-muted-foreground' : 'bg-success text-success-foreground'}>
                      {election.status === 'closed' ? 'Certified' : 'Live'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{participation}% turnout</span>
                  </div>
                  <CardTitle className="text-lg">{election.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {winner && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20 mb-4">
                      <Trophy className="w-5 h-5 text-warning" />
                      <div>
                        <p className="text-xs text-muted-foreground">Leading</p>
                        <p className="font-medium text-foreground">{winner.candidateName}</p>
                      </div>
                      <span className="ml-auto font-bold text-foreground">{winner.percentage}%</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{election.totalVotes.toLocaleString()} votes</span>
                    <span>{election.endDate.toLocaleDateString()}</span>
                  </div>
                  <Link to={`/results/${election.id}`}>
                    <Button variant="outline" className="w-full gap-2">
                      <BarChart3 className="w-4 h-4" />
                      View Full Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Results Available</h3>
          <p className="text-muted-foreground">
            Results will appear here once elections have votes
          </p>
        </Card>
      )}
    </div>
  );
};

export default Results;
