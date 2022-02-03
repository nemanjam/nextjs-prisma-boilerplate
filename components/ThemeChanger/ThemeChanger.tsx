import { FC, MutableRefObject, ReactNode, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { withBem } from 'utils/bem';
import { useHasMounted } from 'components/hooks';
import { themes } from 'lib-client/constants';
import { capitalizeFirstLetter } from 'utils';

type Props = {
  childRef?: MutableRefObject<any>;
};

const ThemeChanger: FC<Props> = ({ childRef }) => {
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
    <span className={b()} ref={childRef} onClick={handleChange}>
      {capitalizeFirstLetter(theme)}
    </span>
  );
};

export default ThemeChanger;
