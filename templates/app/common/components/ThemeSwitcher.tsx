import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Button } from 'componentry/components';
import { useTheme } from 'next-themes';

import { useMounted } from '~/common/hooks';

const themes = {
  light: 'light',
  dark: 'dark',
};

export function ThemeSwitcher() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <Button plain={true} onClick={() => setTheme(theme === themes.dark ? themes.light : themes.dark)} aria-label="theme switch">
      <MoonIcon className="sun" />
      <SunIcon className="moon" />
    </Button>
  );
}
