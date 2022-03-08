import { sum } from './hello'; // abs import doesnt work

test('sum 5 and 2 will return 7', () => {
  //   const a: string = 5;
  expect(sum(5, 2)).toBe(7);
});
