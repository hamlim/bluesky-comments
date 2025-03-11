import type { ReactNode } from "react";

export function Anchor(props: any): ReactNode {
  return (
    <a
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&.state-disabled]:text-gray-400 [&.state-disabled]:cursor-not-allowed text-primary underline-offset-4 hover:underline focus:underline"
      {...props}
    />
  );
}
