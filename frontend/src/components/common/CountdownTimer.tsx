import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isComplete: false,
      });
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isComplete) {
    return (
      <div className={`text-green-500 text-sm font-medium ${className}`}>
        🎉 Delivered!
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      <span>⏳</span>
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      <span>
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
      <span className="ml-1 text-xs text-slate-400">until delivery</span>
    </div>
  );
};

export default CountdownTimer;
