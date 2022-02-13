// @preval

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../tailwind.config.js');

const fullTwConfig = resolveConfig(tailwindConfig);

module.exports = fullTwConfig;
