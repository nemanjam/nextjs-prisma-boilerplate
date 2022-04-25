import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { act, screen } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import ThemeChanger from 'components/ThemeChanger';
import { themes } from 'lib-client/constants';

// mock themes array
// must be here, important
jest.mock('lib-client/constants', () => ({
  ...(jest.requireActual('lib-client/constants') as Record<string, unknown>),
  themes: ['theme-first', 'theme-second', 'theme-third'], // must be here, important
}));
const mockedThemes = jest.mocked(themes, true);

type Props = {
  setRef: (ref: MutableRefObject<any>) => void;
};

const TestThemeChanger: FC<Props> = ({ setRef }) => {
  const childRef = useRef(null);

  useEffect(() => {
    childRef && setRef && setRef(childRef);
  }, [childRef, setRef]);

  return <ThemeChanger childRef={childRef} />;
};

describe('ThemeChanger', () => {
  test('changes theme class and label', async () => {
    let childRef: MutableRefObject<any> = null;
    customRender(<TestThemeChanger setRef={(ref) => (childRef = ref)} />);

    // wait for loader to disappear and isMounted=true
    const themeSpan = await screen.findByTestId(/theme-changer/i);
    expect(themeSpan).toHaveTextContent('system');
    // no class on root here

    act(() => {
      childRef.current.handleChange();
    });

    // assert span content
    expect(themeSpan).toHaveTextContent(mockedThemes[0].replace('theme-', ''));
    // assert class on root element
    expect(document.documentElement).toHaveClass(mockedThemes[0]);

    act(() => {
      childRef.current.handleChange();
    });

    // assert span content
    expect(themeSpan).toHaveTextContent(mockedThemes[1].replace('theme-', ''));
    // assert class on root element
    expect(document.documentElement).toHaveClass(mockedThemes[1]);
  });
});
