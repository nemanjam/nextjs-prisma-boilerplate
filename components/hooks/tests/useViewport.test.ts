import { act, renderHook } from '@testing-library/react';
import { useViewport } from 'components/hooks';

// same as https://github.com/juliencrn/usehooks-ts/blob/master/lib/src/useWindowSize/useWindowSize.test.ts

const windowResize = (value: number): void => {
  window.innerWidth = value;
  window.dispatchEvent(new Event('resize'));
};

describe('useViewport', () => {
  test('should initialize', () => {
    const { result } = renderHook(() => useViewport());
    const { width } = result.current;
    expect(typeof width).toBe('number');
  });

  test('should return the corresponding width', () => {
    const { result } = renderHook(() => useViewport());

    act(() => {
      windowResize(420);
    });

    expect(result.current.width).toBe(420);

    act(() => {
      windowResize(2196);
    });

    expect(result.current.width).toBe(2196);
  });
});
