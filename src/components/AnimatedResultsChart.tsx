import { useState, useEffect } from 'react';
import { VoteResult } from '@/types/election';
import { Trophy, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnimatedResultsChartProps {
  results: VoteResult[];
  totalVotes: number;
  showAnimation?: boolean;
  candidates?: Array<{ id: string; party?: string }>;
}

const AnimatedResultsChart = ({ 
  results, 
  totalVotes, 
  showAnimation = true,
  candidates = []
}: AnimatedResultsChartProps) => {
  const [animatedResults, setAnimatedResults] = useState<VoteResult[]>(
    results.map(r => ({ ...r, percentage: 0, votes: 0 }))
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  const winner = results.length > 0 
    ? results.reduce((a, b) => a.votes > b.votes ? a : b) 
    : null;

  useEffect(() => {
    if (!showAnimation || hasAnimated) {
      setAnimatedResults(results);
      return;
    }

    // Animate results progressively
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

      setAnimatedResults(results.map(result => ({
        ...result,
        percentage: Math.round(result.percentage * easeOut),
        votes: Math.round(result.votes * easeOut),
      })));

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedResults(results);
        setHasAnimated(true);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [results, showAnimation, hasAnimated]);

  const getBarColor = (index: number, isWinner: boolean) => {
    if (isWinner) return 'bg-gradient-to-r from-warning to-warning/70';
    const colors = [
      'bg-gradient-to-r from-primary to-primary/70',
      'bg-gradient-to-r from-accent to-accent/70',
      'bg-gradient-to-r from-success to-success/70',
      'bg-gradient-to-r from-info to-info/70',
    ];
    return colors[index % colors.length];
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Results will appear here once voting begins</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {animatedResults.map((result, index) => {
        const isWinner = winner?.candidateId === result.candidateId;
        const candidate = candidates.find(c => c.id === result.candidateId);
        
        return (
          <div 
            key={result.candidateId} 
            className={`space-y-2 p-4 rounded-xl transition-all duration-300 ${
              isWinner ? 'bg-warning/5 border border-warning/20' : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isWinner && (
                  <div className="relative">
                    <Trophy className="w-5 h-5 text-warning animate-pulse" />
                    <div className="absolute inset-0 w-5 h-5 text-warning animate-ping opacity-30">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                )}
                <span className={`font-semibold ${isWinner ? 'text-warning' : 'text-foreground'}`}>
                  {result.candidateName}
                </span>
                {candidate?.party && (
                  <Badge variant="outline" className="text-xs">
                    {candidate.party}
                  </Badge>
                )}
                {isWinner && (
                  <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">
                    Leading
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold tabular-nums ${isWinner ? 'text-warning' : 'text-foreground'}`}>
                  {result.percentage}%
                </span>
                <span className="text-muted-foreground ml-2 text-sm">
                  ({result.votes.toLocaleString()} votes)
                </span>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="relative h-10 bg-muted/50 rounded-lg overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 ${getBarColor(index, isWinner)} rounded-lg transition-all duration-1000 ease-out`}
                style={{ width: `${result.percentage}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              
              {/* Percentage marker */}
              {result.percentage > 15 && (
                <div 
                  className="absolute inset-y-0 flex items-center px-3"
                  style={{ left: `${Math.min(result.percentage - 10, 90)}%` }}
                >
                  <span className="text-sm font-medium text-white drop-shadow-md">
                    {result.percentage}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Vote Distribution Summary */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-4 justify-center">
          {animatedResults.map((result, index) => {
            const isWinner = winner?.candidateId === result.candidateId;
            return (
              <div 
                key={result.candidateId}
                className="flex items-center gap-2 text-sm"
              >
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isWinner 
                      ? 'bg-warning' 
                      : index === 0 ? 'bg-primary' 
                      : index === 1 ? 'bg-accent' 
                      : index === 2 ? 'bg-success' 
                      : 'bg-info'
                  }`}
                />
                <span className="text-muted-foreground">{result.candidateName.split(' ')[0]}</span>
                <span className="font-medium text-foreground">{result.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedResultsChart;
