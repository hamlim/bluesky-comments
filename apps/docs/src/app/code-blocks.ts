import css from "@shikijs/langs/css";
import shell from "@shikijs/langs/shell";
import typescript from "@shikijs/langs/typescript";
import vitesseDark from "@shikijs/themes/vitesse-dark";
import vitesseLight from "@shikijs/themes/vitesse-light";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const shiki = createHighlighterCoreSync({
  themes: [vitesseLight, vitesseDark],
  langs: [shell, typescript, css],
  engine: createJavaScriptRegexEngine(),
});

function transform(code: string, lang = "shell") {
  return {
    raw: code,
    html: shiki.codeToHtml(code, {
      lang,
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
    }),
  };
}

export let bunInstall = transform(`bun install @hamstack/bluesky-comments`);

export let yarnInstall = transform(`yarn add @hamstack/bluesky-comments`);

export let pnpmInstall = transform(`pnpm install @hamstack/bluesky-comments`);

export let npmInstall = transform(`npm install @hamstack/bluesky-comments`);

export let uriUsage = transform(
  `import {
  CommentSection
} from "@hamstack/bluesky-comments";

<CommentSection
  uri="https://bsky.app/profile/matthamlin.me/post/3lerablgzd22x"
/>`,
  "typescript",
);

export let authorUsage = transform(
  `import {
  CommentSection
} from "@hamstack/bluesky-comments";

<CommentSection
  author="matthamlin.me"
/>`,
  "typescript",
);

export let tailwindConfig = transform(
  `
/* path will depend on where your tailwind root css file is located */
@source "../node_modules/@hamstack/bluesky-comments";
`,
  "css",
);
