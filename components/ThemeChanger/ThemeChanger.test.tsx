import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { act, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import ThemeChanger from 'components/ThemeChanger';
import { themes } from 'lib-client/constants';

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

const testThemes = ['theme-first', 'theme-second', 'theme-third'];

describe('ThemeChanger', () => {
  // mock themes array
  jest.mock('lib-client/constants', () => ({
    ...(jest.requireActual('lib-client/constants') as {}),
    themes: testThemes,
  }));
  const mockedThemes = jest.mocked(themes, true);

  test('changes css class', async () => {
    let childRef: MutableRefObject<any> = null;
    customRender(<TestThemeChanger setRef={(ref) => (childRef = ref)} />);

    const themeSpan = screen.getByTestId(/theme\-changer/i);
    expect(themeSpan).toHaveTextContent('system');

    act(() => {
      childRef.current.handleChange();
    });

    // expect(themeSpan).toHaveTextContent('system');

    screen.debug();
  });
});
