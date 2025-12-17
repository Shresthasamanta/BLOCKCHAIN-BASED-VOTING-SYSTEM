import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Vote, Shield, Lock, Eye, CheckCircle, ArrowRight, 
  Blocks, Users, BarChart3, Clock 
} from 'lucide-react';
import { useElections } from '@/contexts/ElectionContext';

const Landing = () => {
  const { elections } = useElections();
  const activeElections = elections.filter(e => e.status === 'active');

  return (
    <div className="gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Blocks className="w-4 h-4 mr-2" />
            Powered by Blockchain Technology
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Secure, Transparent
            <span className="text-primary block">Blockchain Voting</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cast your vote with confidence. Our blockchain-based platform ensures every vote 
            is encrypted, immutable, and verifiable while maintaining complete voter privacy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/elections">
              <Button size="lg" className="gap-2 text-lg px-8">
                View Elections
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, label: 'End-to-End Encrypted', value: '256-bit' },
            { icon: Lock, label: 'Tamper-Proof Records', value: 'Immutable' },
            { icon: Eye, label: 'Transparent Process', value: 'Auditable' },
            { icon: CheckCircle, label: 'Verified Votes', value: '100%' },
          ].map((item, i) => (
            <Card key={i} className="text-center p-6 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our three-step process ensures secure and verifiable voting
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Authenticate',
                description: 'Securely log in and connect your wallet. Your identity is verified while maintaining privacy.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Cast Your Vote',
                description: 'Review candidates, make your selection, and submit. Your vote is encrypted and recorded on the blockchain.',
                icon: Vote,
              },
              {
                step: '03',
                title: 'Verify & Track',
                description: 'Receive a transaction hash to verify your vote was recorded. Track results in real-time.',
                icon: BarChart3,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-bold text-primary/10 absolute -top-4 left-0">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Elections Preview */}
      {activeElections.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Active Elections</h2>
              <p className="text-muted-foreground">Participate in ongoing elections</p>
            </div>
            <Link to="/elections">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeElections.slice(0, 3).map((election) => (
              <Card key={election.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.ceil((election.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{election.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {election.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm">
                      <span className="text-foreground font-medium">{election.totalVotes.toLocaleString()}</span>
                      <span className="text-muted-foreground"> / {election.eligibleVoters.toLocaleString()} voted</span>
                    </div>
                    <Link to={`/elections/${election.id}`}>
                      <Button size="sm" className="gap-1">
                        Vote Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Ready to Experience Secure Voting?
          </h2>
          <p className="text-lg text-secondary-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations using blockchain technology to ensure fair and transparent elections.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2 text-lg px-8">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
