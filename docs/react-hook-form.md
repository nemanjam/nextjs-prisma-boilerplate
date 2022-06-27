### React hook form

- [docs](https://react-hook-form.com/advanced-usage)
- async default values [issue](https://github.com/react-hook-form/react-hook-form/issues/2492#issuecomment-771578524)

### Dropzone

- Dropzone with react hook form [tutorial](https://dev.to/vibhanshu909/how-to-use-react-dropzone-with-react-hook-form-1omc)

### Validation

- next-validations usage with next-connect [example](https://github.com/jellydn/next-validations/discussions/170)
- React-hook-form [zodResolver](https://github.com/react-hook-form/resolvers)
- [zod schema validator](https://github.com/colinhacks/zod)

### React hook form async default values and reset

- github issue [example](https://github.com/react-hook-form/react-hook-form/issues/2492#issuecomment-771578524)

### Avatar and Header submit and reset bugs

- it was my mistake, not react-hook-form v8 bug, condition was too loose and resetForm() was called
- initial value for image must not be undefined, he wrote in issues, maybe cause for reset images fail
- 3 states for images and text, many rerenders, maybe can be better
- Dropzone is simple and fine
- maybe solve it with useQuery dependant queries without suspense

```ts
// both images and text are loaded
const isLoadingCompleted = !isAvatarLoading && !isHeaderLoading && !isTextFieldsLoading;

if (isMounted && user && !isLoadingCompleted) {
  run(user);
}
// include these in dependencies
// important: because they are returned from the hook, can be stale
// otherwise it sets undefined images
getValues,
reset,
```

- **Note: `__dirname` fails, it gives path of COMPILED file**
- use `cwd()` once in utils.ts for root dir in next.js app and reuse it

```ts
const rootDirAbsolutePath = join(__dirname, '..');

// join(__dirname, '..') is wrong, gives:
// ...nextjs-prisma-boilerplate/.next/server/pages/api/
// fails in seed too
```
