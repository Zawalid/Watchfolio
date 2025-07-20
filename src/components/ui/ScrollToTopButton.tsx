import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const SIZE = 50;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(percent);
      setVisible(scrollTop > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      aria-label='Scroll to top'
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
      className={`group fixed right-6 bottom-7 z-50 transition-all duration-300 hover:scale-110 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ width: SIZE, height: SIZE }}
    >
      <span
        className='absolute inset-0 rounded-full bg-white/5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 group-hover:bg-white/10'
        style={{ width: SIZE, height: SIZE }}
      />

      {/* Progress circle */}
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className='absolute top-0 left-0'>
        {/* Background circle */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke='rgba(255, 255, 255, 0.1)'
          strokeWidth={STROKE}
          fill='none'
        />
        {/* Progress circle */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke='#1ea5fc'
          strokeWidth={STROKE}
          fill='none'
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          strokeLinecap='round'
          style={{ transition: 'stroke-dashoffset 0.2s' }}
        />
      </svg>

      {/* Arrow icon */}
      <span className='absolute inset-0 flex items-center justify-center'>
        <ArrowUp className='size-6 text-white' />
      </span>
    </button>
  );
}
