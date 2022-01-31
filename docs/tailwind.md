### Responsive Navbar

- [tutorial](https://www.notimedad.dev/responsive-navbar-tailwind-react/#Products)

### Custom Tailwind React button

- [tutorial](https://www.luckymedia.dev/blog/creating-a-reusable-button-component-with-react-and-tailwind)

### Custom fonts Tailwind

- youtube [tutorial](https://www.youtube.com/watch?v=sOnBG2wUm1s)

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
