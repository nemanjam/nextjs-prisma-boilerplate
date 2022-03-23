import { B } from 'b_';

export const b_ = B({
  tailSpace: '',
  elementSeparator: '__',
  modSeparator: '--',
  modValueSeparator: '-',
  classSeparator: ' ',
});

type WithType = typeof b_.with;

export const withBem: WithType = b_.with.bind(b_);

export const getErrorClass = (value: unknown) => (value ? ' validation-error' : '');
