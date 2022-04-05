import { FC, MutableRefObject, useImperativeHandle } from 'react';
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

  const handleChange = () => {
    const index = themes.indexOf(theme);
    const newIndex = index === themes.length - 1 ? 0 : index + 1;
    setTheme(themes[newIndex]);
  };

  useImperativeHandle(childRef, () => ({
    handleChange,
  }));

  const getThemeAlias = (theme: string) => theme.toLowerCase().replace('theme-', '');

  if (!isMounted) return null;

  return <span className={b()}>{getThemeAlias(theme)}</span>;
};

export default ThemeChanger;
