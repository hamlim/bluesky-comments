import { CommentSection } from "@hamstack/bluesky-comments";
import { StarIcon } from "lucide-react";
import { Anchor } from "#components/anchor";
import { CopyButton } from "#components/copy-button";
import { Button } from "#components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { mdxComponents } from "#utils/mdx-components";

import { InlineCode } from "#components/typeography";

import {
  authorUsage,
  bunInstall,
  npmInstall,
  pnpmInstall,
  tailwindConfig,
  uriUsage,
  yarnInstall,
} from "./code-blocks" with { type: "macro" };

function CodeBlock(props: { children: { raw: string; html: string } }) {
  return (
    <div className="relative">
      <CopyButton
        value={props.children.raw}
        className="absolute right-2 top-2 h-8 w-8 hover:bg-muted/30"
      />
      <code
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: props.children.html }}
        className="[&>pre]:p-4 [&>pre]:rounded-md [&>pre]:overflow-auto my-2 [&>pre]:font-mono [&>pre]:pr-12 block"
      />
    </div>
  );
}

let sectionClasses =
  "py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 max-w-[75ch] mx-auto min-h-[40vh] flex flex-col justify-center gap-4";

export default function Homepage() {
  return (
    <main>
      <header className={sectionClasses}>
        <div className="text-center flex gap-4 flex-col">
          <mdxComponents.h1>Bluesky Comments 🦋</mdxComponents.h1>
          <p>Add comments to any URL, powered by Bluesky!</p>
        </div>
        <div className="pt-10 flex row justify-evenly items-center">
          <Button asChild>
            <a href="#installation">Get Started</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/hamlim/bluesky-comments">
              <StarIcon className="mr-2 inline-flex" /> Star on GitHub
            </a>
          </Button>
        </div>
      </header>
      <section className={sectionClasses}>
        <mdxComponents.h2>Installation:</mdxComponents.h2>
        <p>
          Install <InlineCode>@hamstack/bluesky-comments</InlineCode> via your
          favorite package manager:
        </p>
        <Tabs defaultValue="bun">
          <TabsList>
            <TabsTrigger value="bun">Bun</TabsTrigger>
            <TabsTrigger value="yarn">Yarn</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="npm">npm</TabsTrigger>
          </TabsList>
          <div className="my-10">
            <TabsContent value="bun">
              <CodeBlock>{bunInstall}</CodeBlock>
            </TabsContent>
            <TabsContent value="yarn">
              <CodeBlock>{yarnInstall}</CodeBlock>
            </TabsContent>
            <TabsContent value="pnpm">
              <CodeBlock>{pnpmInstall}</CodeBlock>
            </TabsContent>
            <TabsContent value="npm">
              <CodeBlock>{npmInstall}</CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
        <p>
          Importantly, <InlineCode>@hamstack/bluesky-comments</InlineCode> uses
          Tailwind for styling, you&apos;ll need to ensure you configure
          Tailwind to scan the library for classnames.
        </p>
        <p>
          Here&apos;s an example using Tailwind v4 configuration within a{" "}
          <InlineCode>.css</InlineCode> file:
        </p>
        <CodeBlock>{tailwindConfig}</CodeBlock>
      </section>
      <section className={sectionClasses}>
        <mdxComponents.h2>Usage:</mdxComponents.h2>
      </section>
      <section className={sectionClasses}>
        <mdxComponents.h3>With an explicit URI:</mdxComponents.h3>
        <p>
          Import the <InlineCode>CommentSection</InlineCode> component and pass
          it a Bluesky URI:
        </p>
        <CodeBlock>{uriUsage}</CodeBlock>
        <p>Live example:</p>
        <CommentSection uri="https://bsky.app/profile/matthamlin.me/post/3lerablgzd22x" />
      </section>
      <section className={sectionClasses}>
        <mdxComponents.h3>Automatic URI detection:</mdxComponents.h3>
        <p>
          If you do not provide a <InlineCode>uri</InlineCode> prop, you can
          instead pass in an <InlineCode>author</InlineCode> prop and the
          component will automatically look up the most liked post by the author
          that references the current URL (e.g.
          <InlineCode>window.location.href</InlineCode>)
        </p>
        <CodeBlock>{authorUsage}</CodeBlock>
        <p>Live Example:</p>
        <CommentSection author="matthamlin.me" />
        <p>
          (Note: If there is no post found with the current URL, then nothing
          will be rendered)
        </p>
      </section>
      <section className={sectionClasses}>
        <mdxComponents.h2>About:</mdxComponents.h2>
        <p>
          This library is a fork of the original{" "}
          <Anchor href="https://www.npmjs.com/package/bluesky-comments">
            bluesky-comments
          </Anchor>{" "}
          package.
        </p>
        <p>This fork makes the following core changes:</p>
        <mdxComponents.ul className="list-disc list-inside">
          <mdxComponents.li>
            Use tailwind for styling instead of a separate stylesheet
          </mdxComponents.li>
          <mdxComponents.li>
            Externalize all dependencies used by the library, and require them
            as peerDeps (e.g. <InlineCode>@atproto/api</InlineCode>)
          </mdxComponents.li>
        </mdxComponents.ul>
      </section>
      <footer className={sectionClasses}>
        <p>
          The source code for the library is available on{" "}
          <Anchor href="https://github.com/hamlim/bluesky-comments">
            GitHub
          </Anchor>
          . If you run into any bugs, please report them via{" "}
          <Anchor href="https://github.com/hamlim/bluesky-comments/issues/new">
            issues
          </Anchor>
          .
        </p>
        <p>
          If you&apos;d like to discuss changes to the project, feel free to
          start a{" "}
          <Anchor href="https://github.com/hamlim/bluesky-comments/discussions/new/choose">
            discussion
          </Anchor>
          !
        </p>
      </footer>
    </main>
  );
}
