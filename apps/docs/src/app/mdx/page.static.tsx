import Component, { frontmatter } from "./test.mdx";

export default async function MDXDemoPage() {
  return (
    <section className="font-mono">
      <pre className="font-mono">{JSON.stringify(frontmatter, null, 2)}</pre>
      <div className="border border-gray-200 rounded-lg p-4">
        <Component />
      </div>
    </section>
  );
}
