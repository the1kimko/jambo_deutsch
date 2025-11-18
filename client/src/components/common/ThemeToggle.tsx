import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'default' | 'compact';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, size = 'default' }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (mounted ? resolvedTheme : 'light') === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size === 'compact' ? 'sm' : 'icon'}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'rounded-full border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60',
        size === 'compact' ? 'px-4 justify-center gap-2 text-xs font-medium' : '',
        className
      )}
    >
      {isDark ? (
        <Sun className={cn('h-4 w-4', size === 'compact' ? '' : '')} />
      ) : (
        <Moon className={cn('h-4 w-4', size === 'compact' ? '' : '')} />
      )}
      {size === 'compact' && <span>{isDark ? 'Light' : 'Dark'}</span>}
    </Button>
  );
};

export default ThemeToggle;
