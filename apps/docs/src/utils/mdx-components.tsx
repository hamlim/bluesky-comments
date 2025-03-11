import type { ReactNode } from "react";

export let mdxComponents = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  h1: (props: any): ReactNode => (
    <h1
      className="text-4xl font-bold text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  h2: (props: any): ReactNode => (
    <h2
      className="text-3xl font-semibold text-gray-800 dark:text-gray-200"
      {...props}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  h3: (props: any): ReactNode => (
    <h3
      className="text-2xl font-medium text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  h4: (props: any): ReactNode => (
    <h4
      className="text-xl font-medium text-gray-600 dark:text-gray-400"
      {...props}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  h5: (props: any): ReactNode => (
    <h5 className="text-lg font-medium text-gray-500" {...props} />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  h6: (props: any): ReactNode => (
    <h6
      className="text-base font-medium text-gray-400 dark:text-gray-600"
      {...props}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  a: (props: any): ReactNode => (
    <a
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&.state-disabled]:text-gray-400 [&.state-disabled]:cursor-not-allowed text-primary underline-offset-4 hover:underline focus:underline"
      {...props}
    />
  ),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  p: (props: any): ReactNode => <p {...props} />,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ul: (props: any): ReactNode => <ul {...props} />,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ol: (props: any): ReactNode => <ol {...props} />,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  li: (props: any): ReactNode => <li {...props} />,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  blockquote: (props: any): ReactNode => <blockquote {...props} />,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  pre: (props: any): ReactNode => <pre {...props} />,
} as const;

export function useMDXComponents() {
  return mdxComponents;
}
