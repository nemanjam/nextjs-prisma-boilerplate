import { B } from 'b_';

export const b_ = B({
  tailSpace: '',
  elementSeparator: '__',
  modSeparator: '--',
  modValueSeparator: '-',
  classSeparator: ' ',
});

// --------- repeat types

interface Mods {
  [name: string]: any;
}

interface BlockFormatter {
  (mods?: Mods): string;
  (elem: string | null, mods?: Mods): string; // this: string | null
}

type ElemFormatter = (mods?: Mods) => string;

interface Formatter {
  with(block: string): BlockFormatter;
  with(block: string, elem: string): ElemFormatter;
}

// ---------------

export const withBem = b_.with.bind(b_) as Formatter['with'];

export const getErrorClass = (value: unknown) => (value ? ' validation-error' : '');
