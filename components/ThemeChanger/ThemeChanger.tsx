import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { withBem } from 'utils/bem';
import { useHasMounted } from 'components/hooks';
import { themes } from 'lib-client/constants';

const ThemeChanger: FC = () => {
  const mounted = useHasMounted();
  const { theme, setTheme } = useTheme();
  const [index, setIndex] = useState(0);

  const b = withBem('theme-changer');

  const handleChange = () => {
    const newIndex = index === themes.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
  };

  useEffect(() => {
    setTheme(themes[index]);
  }, [index, themes]);

  if (!mounted) return null;

  return (
    <span className={b()}>
      <span onClick={handleChange}>{theme}</span>
    </span>
  );
};

export default ThemeChanger;
