import type { ReactNode } from "react";

export function InlineCode(props: { children: ReactNode }) {
  return (
    <code className="bg-muted text-sm text-black px-2 py-1 rounded-md font-mono">
      {props.children}
    </code>
  );
}
