import { FC, ReactNode, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BsSun } from 'react-icons/bs';
import { withBem } from 'utils/bem';
import { useHasMounted } from 'components/hooks';
import { themes } from 'lib-client/constants';
import { NavLink } from 'components/Navbar';
import { capitalizeFirstLetter } from 'utils';

const ThemeChanger: FC = () => {
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  const initialTheme = themes.indexOf(theme);
  const [index, setIndex] = useState(initialTheme);

  const b = withBem('theme-changer');

  const handleChange = () => {
    const newIndex = index === themes.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
  };

  useEffect(() => {
    setTheme(themes[index]);
  }, [index, themes]);

  if (!hasMounted) return null;

  return (
    <span className={b()} onClick={handleChange}>
      <NavLink icon={<BsSun />}>{capitalizeFirstLetter(theme)}</NavLink>
    </span>
  );
};

export default ThemeChanger;
