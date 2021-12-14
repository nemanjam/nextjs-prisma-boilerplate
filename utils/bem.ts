import { B } from 'b_';

export const b_ = B({
  tailSpace: ' ',
  elementSeparator: '__',
  modSeparator: '--',
  modValueSeparator: '-',
  classSeparator: ' ',
});

export const withBem = b_.with;
