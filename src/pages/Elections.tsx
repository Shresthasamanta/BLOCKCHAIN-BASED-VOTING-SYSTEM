import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vote, Clock, Users, ArrowRight, Search, Calendar,
  CheckCircle, AlertCircle, Timer
} from 'lucide-react';
import { useElections } from '@/contexts/ElectionContext';
import { Election, ElectionStatus } from '@/types/election';
import CountdownTimer from '@/components/CountdownTimer';

const statusConfig: Record<ElectionStatus, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'bg-success text-success-foreground', icon: Vote },
  upcoming: { label: 'Upcoming', color: 'bg-accent text-accent-foreground', icon: Timer },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-warning text-warning-foreground', icon: AlertCircle },
};

const ElectionCard = ({ election }: { election: Election }) => {
  const config = statusConfig[election.status];
  const StatusIcon = config.icon;
  
  const participation = Math.round((election.totalVotes / election.eligibleVoters) * 100);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge className={config.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors mb-2">
          {election.title}
        </CardTitle>
        {/* Live Countdown for Active Elections */}
        {election.status === 'active' && (
          <div className="mt-2 mb-2 scale-75 origin-left">
            <CountdownTimer targetDate={election.endDate} label="Voting ends in" />
          </div>
        )}
        {election.status === 'upcoming' && (
          <div className="mt-2 mb-2 scale-75 origin-left">
            <CountdownTimer targetDate={election.startDate} label="Voting starts in" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {election.description}
        </p>
        
        {/* Candidates Preview */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {election.candidates.length} candidate{election.candidates.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Participation</span>
            <span className="font-medium text-foreground">{participation}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${participation}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{election.totalVotes.toLocaleString()} votes</span>
            <span>{election.eligibleVoters.toLocaleString()} eligible</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {election.startDate.toLocaleDateString()}
          </div>
          <span>→</span>
          <div>{election.endDate.toLocaleDateString()}</div>
        </div>

        {/* Action Button */}
        <Link to={election.status === 'closed' ? `/results/${election.id}` : `/elections/${election.id}`}>
          <Button className="w-full gap-2" variant={election.status === 'active' ? 'default' : 'outline'}>
            {election.status === 'active' && 'Vote Now'}
            {election.status === 'upcoming' && 'View Details'}
            {election.status === 'closed' && 'View Results'}
            {election.status === 'draft' && 'Preview'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Elections = () => {
  const { elections } = useElections();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || election.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const counts = {
    all: elections.length,
    active: elections.filter(e => e.status === 'active').length,
    upcoming: elections.filter(e => e.status === 'upcoming').length,
    closed: elections.filter(e => e.status === 'closed').length,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Elections</h1>
        <p className="text-lg text-muted-foreground">
          Browse and participate in available elections
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search elections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({counts.upcoming})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Elections Grid */}
      {filteredElections.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election) => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No elections found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try adjusting your search query' : 'No elections match the selected filter'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Elections;
