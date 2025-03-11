/* this file is automatically generated by garbanzo */
/* DO NOT MANUALLY EDIT THIS FILE */

import { createPages } from "waku";
import type { PathsForPages } from "waku/router";

import layout0 from "./app/@layout";
import root1 from "./app/@root";
import page2 from "./app/page";

let pages = createPages(async ({ createPage, createLayout, createRoot, createApi }) => [
createLayout({
  render: "dynamic",
  path: "/",
  component: layout0,
}),
createRoot({
  render: "dynamic",
  component: root1,
}),
createPage({
  render: "dynamic",
  path: "/",
  component: page2,
}),
]);

declare module "waku/router" {
  interface RouteConfig {
    paths: PathsForPages<typeof pages>;
  }
  interface CreatePagesConfig {
    pages: typeof pages;
  }
}

export default pages;