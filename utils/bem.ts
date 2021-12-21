import { B } from 'b_';

export const b_ = B({
  tailSpace: '',
  elementSeparator: '__',
  modSeparator: '--',
  modValueSeparator: '-',
  classSeparator: ' ',
});

export const withBem = b_.with.bind(b_);

export const getErrorClass = (value: unknown) => (value ? ' validation-error' : '');
