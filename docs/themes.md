### next-themes

#### Light/dark/green/yellow - multiple color themes

- [tutorial](https://darrenwhite.dev/blog/nextjs-tailwindcss-theming), [repo](https://github.com/dwhiteGUK/dlw-nextjs-tailwindcss-theming)
- idea: from tw constants -> css vars -> tw utility classes
- tw utility classes read css vars, css vars live on html tag with selector <html attribute>, change selector - change vars
- `th-background th-...` is a single theme utility classes under which all themes are

```
// styles/global.css - from tw theme into css vars
--background: theme("colors.white");
---
// tailwind.config.js - from css vars into tw utility classes
'th-background': 'var(--background)',

```

---

- color example with class selectors in \_document.tsx, css vars and tw utility classes [youtube tutorial](https://www.youtube.com/watch?v=e6ExRHx9bo4)

#### Only light/dark themes

- for dark/light mode and `next-themes` and `tailwind` only needs this, and thats it
- [youtube tutorial](https://www.youtube.com/watch?v=1q5oOZE6o4c)
- example here [leerob.io repo](https://github.dev/leerob/leerob.io/)

```
// pages/_app.tsx
<ThemeProvider attribute="class">
---
// tailwind.config.js
darkMode: 'class',
```

- next-themes only changes `<html data-theme="emerald">` attribute/class value? you can change it in `_document.tsx` on body tag

### Tailwind themes docs

- [theme](https://tailwindcss.com/docs/theme)
- [customizing-colors](https://tailwindcss.com/docs/customizing-colors)
- problem: concatenated classes on html element, solution: both `themes` array and `attribute` props must be set `<ThemeProvider themes={themes} attribute="class">`

- support opacity

```js
function withOpacityValue(_variable) {
  return ({ opacityValue }) => {
    const variable = hexToRgb(_variable);

    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

function hexToRgb(hex) {
  console.log('hex', hex);
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  console.log('result', result);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
```

### Themes plugin

- .class is injected in base, problem is .emerald, .pink... are purged, they dont exist in template
- theme must be plugin to convert hex to rgb at buildtime

- problem: compilation error with @apply

```
Syntax error: "test-class-base" class does not exist. If "test-class-base" is a custom class, make sure it is defined within a @layer directive.
```

- solution: scss files must not be imported in .tsx files but all scss files into a single index.scss and then it into \_app.tsx

```
afaik you can only use @apply when the class is either from the tailwind config, or in the same file
```

- rgba() syntax

```css
/* old notation */
color: rgb(255, 255, 255);
color: rgba(255, 255, 255, 1);

/* new notation */
color: rgb(255 255 255);
color: rgb(255 255 255 / 1);
```

- opacity and bg-opacity is not same, opacity - content too
- for hovers: `hover:bg-th-base-content hover:bg-opacity-5`
- for borders: `border-th-base-200`

### Convert Hex to RGB

- [converting](https://css-tricks.com/converting-color-spaces-in-javascript/)
- color [units](https://dev.to/alvaromontoro/the-ultimate-guide-to-css-colors-2020-edition-1bh1)

### DaisyUI

- themes and components [website](https://daisyui.com/)
- [repository](https://github.com/saadeghi/daisyui)
