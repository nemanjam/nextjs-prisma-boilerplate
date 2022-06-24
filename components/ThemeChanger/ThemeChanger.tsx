import { FC, MutableRefObject, useEffect, useImperativeHandle } from 'react';
import { useTheme } from 'next-themes';
import { withBem } from 'utils/bem';
import { useIsMounted } from 'components/hooks';
import { themes } from 'lib-client/constants';

type Props = {
  childRef?: MutableRefObject<any>;
};

const ThemeChanger: FC<Props> = ({ childRef }) => {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();

  const b = withBem('theme-changer');

  // set default theme on load maybe
  useEffect(() => {
    if (!isMounted || theme !== 'system') return;

    const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME;
    const isValidTheme = themes.includes(defaultTheme);

    if (isValidTheme) setTheme(defaultTheme);
  }, [theme, isMounted]);

  const handleChange = () => {
    if (!theme) return;

    const index = themes.indexOf(theme);
    const newIndex = index === themes.length - 1 ? 0 : index + 1;
    setTheme(themes[newIndex]);
  };

  useImperativeHandle(childRef, () => ({
    handleChange,
  }));

  const getThemeAlias = (theme: string) => theme.toLowerCase().replace('theme-', '');

  if (!isMounted) return null;

  return (
    <span data-testid="theme-changer" className={b()}>
      {theme && getThemeAlias(theme)}
    </span>
  );
};

export default ThemeChanger;
