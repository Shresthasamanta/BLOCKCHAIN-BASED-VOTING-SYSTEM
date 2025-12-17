import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useElections } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, Settings, BarChart3, Users, Vote, Clock,
  Edit, Trash2, Play, Pause, CheckCircle, AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Election, ElectionStatus } from '@/types/election';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { elections, createElection, updateElectionStatus } = useElections();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const handleCreateElection = () => {
    if (!newElection.title || !newElection.startDate || !newElection.endDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    createElection({
      title: newElection.title,
      description: newElection.description,
      status: 'draft',
      startDate: new Date(newElection.startDate),
      endDate: new Date(newElection.endDate),
      candidates: [],
      eligibleVoters: 2500,
      createdBy: user?.id || 'admin',
    });

    toast({ title: 'Success', description: 'Election created successfully' });
    setShowCreateDialog(false);
    setNewElection({ title: '', description: '', startDate: '', endDate: '' });
  };

  const handleStatusChange = (id: string, status: ElectionStatus) => {
    updateElectionStatus(id, status);
    toast({ title: 'Status Updated', description: `Election status changed to ${status}` });
  };

  const stats = {
    total: elections.length,
    active: elections.filter(e => e.status === 'active').length,
    upcoming: elections.filter(e => e.status === 'upcoming').length,
    totalVotes: elections.reduce((sum, e) => sum + e.totalVotes, 0),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage elections and monitor voting activity</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Election
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Vote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Elections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Elections</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalVotes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Votes Cast</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elections Management */}
      <Card>
        <CardHeader>
          <CardTitle>Elections Management</CardTitle>
          <CardDescription>View and manage all elections</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {elections.map((election) => (
                <ElectionRow 
                  key={election.id} 
                  election={election} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {elections.filter(e => e.status === 'active').map((election) => (
                <ElectionRow 
                  key={election.id} 
                  election={election} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TabsContent>

            <TabsContent value="draft" className="space-y-4">
              {elections.filter(e => e.status === 'draft').map((election) => (
                <ElectionRow 
                  key={election.id} 
                  election={election} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TabsContent>

            <TabsContent value="closed" className="space-y-4">
              {elections.filter(e => e.status === 'closed').map((election) => (
                <ElectionRow 
                  key={election.id} 
                  election={election} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Election Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title *</Label>
              <Input
                id="title"
                placeholder="e.g., 2024 Board Election"
                value={newElection.title}
                onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this election..."
                value={newElection.description}
                onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Date *</Label>
                <Input
                  id="start"
                  type="date"
                  value={newElection.startDate}
                  onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Date *</Label>
                <Input
                  id="end"
                  type="date"
                  value={newElection.endDate}
                  onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateElection}>Create Election</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ElectionRow = ({ 
  election, 
  onStatusChange 
}: { 
  election: Election;
  onStatusChange: (id: string, status: ElectionStatus) => void;
}) => {
  const statusColors: Record<ElectionStatus, string> = {
    draft: 'bg-warning/10 text-warning',
    upcoming: 'bg-accent/10 text-accent',
    active: 'bg-success/10 text-success',
    closed: 'bg-muted text-muted-foreground',
  };

  const participation = Math.round((election.totalVotes / election.eligibleVoters) * 100);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold text-foreground">{election.title}</h3>
          <Badge className={statusColors[election.status]}>
            {election.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{election.candidates.length} candidates</span>
          <span>•</span>
          <span>{election.totalVotes.toLocaleString()} votes ({participation}%)</span>
          <span>•</span>
          <span>{election.startDate.toLocaleDateString()} - {election.endDate.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {election.status === 'draft' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={() => onStatusChange(election.id, 'active')}
          >
            <Play className="w-4 h-4" />
            Start
          </Button>
        )}
        {election.status === 'active' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={() => onStatusChange(election.id, 'closed')}
          >
            <Pause className="w-4 h-4" />
            Close
          </Button>
        )}
        <Button size="sm" variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
