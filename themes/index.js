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
    // in color-names: th-primary
    // in theme: primary
    const colorKey = prefixedColorName(rule);
    resultObject[colorNames[colorKey]] = colorNames.hasOwnProperty(colorKey)
      ? hexToRgb(value)
      : value;
  });
  return resultObject;
}

const mainFunction = ({ addBase }) => {
  const resultThemes = {};
  Object.entries(themes).forEach(([selector, theme], index) => {
    const _selector = index === 0 ? ':root' : selector;

    resultThemes[_selector] = convertThemeColorsToRgb(theme);
  });

  console.log('resultThemes', resultThemes);
  addBase(resultThemes);

  addBase({
    'test-class': {
      backgroundColor: 'yellow',
    },
  });
};

// mainFunction({ addBase: 1 });

const colorFns = {};
Object.entries(colorNames).forEach(([name, value]) => {
  colorFns[prefixedColorName(name)] = withOpacity(value);
});

module.exports = plugin(mainFunction, {
  theme: { extend: { colors: colorFns } },
});
