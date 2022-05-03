// fix for Jest 28:
// Jest encountered an unexpected token
// import { zodResolver } from '@hookform/resolvers/zod';
// https://github.com/react-hook-form/resolvers/issues/396#issuecomment-1114248072

module.exports = (path, options) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg) => {
      if (pkg.name === '@hookform/resolvers') {
        delete pkg['exports'];
        delete pkg['module'];
      }
      return pkg;
    },
  });
};
