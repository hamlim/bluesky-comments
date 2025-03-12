# `@hamstack/bluesky-comments`

A minimal suite of components to render Bluesky comments on any URL!

A partial fork of [`bluesky-comments`](https://github.com/czue/bluesky-comments)!

## Getting Started:

```bash
bun add @hamstack/bluesky-comments @atproto/api
```

## Usage:

```tsx
import {CommentSection} from '@hamstack/bluesky-comments';

<CommentSection uri="<bluesky-uri>" />
// or
// to automatically find the most liked post by an author with the current URL referenced:
<CommentSection author="<handle>" />
```

## Contributing:

### Building:

This library uses [`swc`](https://swc.rs/) and [`TypeScript`](https://www.typescriptlang.org/docs/) to build the source code and generate types.

To build the library, run `bun run build` from the root, or from this workspace!

### Code Quality:

#### Type Checking:

This library uses TypeScript to perform type checks, run `bun run type-check` from the root or from this workspace!

#### Linting

This library uses [BiomeJS](https://biomejs.dev/) for linting, run `bun run lint` from the root or from this workspace!

#### Tests

This library uses Bun for running unit tests, run `bun run test` from the root or from this workspace!

### Publishing:

To publish the library, run `bun run pub` from the workspace root. This will prompt you to login to npm and publish the package.

> Note: In the future, we will automate this process using GitHub Actions. And also add in tooling to manage releases / changelogs!
