import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate, label = "Time Remaining", onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      
      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
          <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-primary/20 rounded-full" />
      </div>
      <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );

  const Separator = () => (
    <div className="flex flex-col items-center justify-center gap-2 pb-6">
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );

  if (isComplete) {
    return (
      <div className="text-center p-6 rounded-xl bg-warning/10 border border-warning/20">
        <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
        <p className="text-lg font-semibold text-warning">Time's Up!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
        <Clock className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <TimeBlock value={timeLeft.days} label="Days" />
        <Separator />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <Separator />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default CountdownTimer;
