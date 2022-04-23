const plugin = require('tailwindcss/plugin');
const colorNames = require('./color-names');
const themes = require('./themes');
const hexToRgb = require('./hex-to-rgb');
const withOpacity = require('./with-opacity');

const prefix = 'th-';
function prefixedColorName(name) {
  return `${prefix}${name}`;
}

function convertThemeColorsToRgb(theme) {
  const resultObject = {};
  Object.entries(theme).forEach(([rule, value]) => {
    // neither themes nor colorNames have th- prefix
    // just for eslint
    if (Object.prototype.hasOwnProperty.call(colorNames, rule)) {
      resultObject[colorNames[rule]] = hexToRgb(value);
    } else {
      resultObject[rule] = value;
    }
  });
  return resultObject;
}

// Next.js env vars are available here
const isDefaultTheme = (selector, index) => {
  const defaultThemeSelector = `.${process.env.DEFAULT_THEME}`;

  const isValidTheme = Object.entries(themes)
    .map(([selector]) => selector)
    .includes(defaultThemeSelector);

  // if not specified or invalid, first is default
  if (!process.env.DEFAULT_THEME || !isValidTheme) return index === 0;

  return selector === defaultThemeSelector;
};

const mainFunction = ({ addBase }) => {
  const resultThemes = {};
  Object.entries(themes).forEach(([selector, theme], index) => {
    const _selector = isDefaultTheme(selector, index) ? ':root' : selector;
    resultThemes[_selector] = convertThemeColorsToRgb(theme);
  });

  // console.log('resultThemes', resultThemes);
  addBase(resultThemes);
};

// mainFunction({ addBase: 1 });

const colorFns = {};
// colorNames without prefix, add th- prefix here
Object.entries(colorNames).forEach(([name, value]) => {
  colorFns[prefixedColorName(name)] = withOpacity(value);
});

module.exports = plugin(mainFunction, {
  theme: { extend: { colors: colorFns } },
});
