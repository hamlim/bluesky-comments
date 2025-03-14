/// <reference lib="dom" />
"use client";

import type {
  AppBskyFeedDefs,
  AppBskyFeedGetPostThread,
  AppBskyFeedPost,
} from "@atproto/api";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Temporarily inlining the following code from @atproto/api
// it wasn't playing nicely in vite in both the browser and node
type $Type<Id extends string, Hash extends string> = Hash extends "main"
  ? Id
  : `${Id}#${Hash}`;

type $TypedObject<V, Id extends string, Hash extends string> = V extends {
  $type: $Type<Id, Hash>;
}
  ? V
  : V extends { $type?: string }
    ? V extends { $type?: infer T extends $Type<Id, Hash> }
      ? V & { $type: T }
      : never
    : V & { $type: $Type<Id, Hash> };

function isObject<V>(v: V): v is V & object {
  return v != null && typeof v === "object";
}

function is$type<Id extends string, Hash extends string>(
  $type: unknown,
  id: Id,
  hash: Hash,
): $type is $Type<Id, Hash> {
  return hash === "main"
    ? $type === id
    : // $type === `${id}#${hash}`
      typeof $type === "string" &&
        $type.length === id.length + 1 + hash.length &&
        $type.charCodeAt(id.length) === 35 /* '#' */ &&
        $type.startsWith(id) &&
        $type.endsWith(hash);
}

function is$typed<V, Id extends string, Hash extends string>(
  v: V,
  id: Id,
  hash: Hash,
): v is $TypedObject<V, Id, Hash> {
  return isObject(v) && "$type" in v && is$type(v.$type, id, hash);
}

const hashThreadViewPost = "threadViewPost";

function isThreadViewPost(v: unknown): v is AppBskyFeedDefs.ThreadViewPost {
  const id = "app.bsky.feed.defs";
  return is$typed(v, id, hashThreadViewPost);
}

function isRecord(v: unknown): v is AppBskyFeedPost.Record {
  const id = "app.bsky.feed.post";
  const hashRecord = "main";
  return is$typed(v, id, hashRecord);
}

// end inlining

type PlainFilter = (comment: AppBskyFeedDefs.ThreadViewPost) => boolean;

type CommentProps = {
  comment: AppBskyFeedDefs.ThreadViewPost;
  filters?: Array<PlainFilter>;
};

export interface CommentEmptyDetails {
  code: string;
  message: string;
}

export interface CommentOptions {
  uri?: string;
  author?: string;
  commentFilters?: Array<PlainFilter>;
  onEmpty?: (details: CommentEmptyDetails) => void;
}

export function Comment({ comment, filters }: CommentProps): ReactNode {
  let author = comment.post.author;

  if (!isRecord(comment.post.record)) {
    return null;
  }
  // filter out replies that match any of the commentFilters, by ensuring they all return false
  if (filters && !filters.every((filter) => !filter(comment))) {
    return null;
  }

  return (
    <div className="my-4 text-sm">
      <div className="flex max-w-[36rem] flex-col gap-2">
        <a
          className="flex flex-row justify-start items-center gap-2 hover:underline"
          href={`https://bsky.app/profile/${author.did}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {author.avatar ? (
            <img
              src={comment.post.author.avatar}
              alt="avatar"
              className="h-4 w-4 flex-shrink-0 rounded-full bg-gray-300"
            />
          ) : (
            <div className="h-4 w-4 flex-shrink-0 rounded-full bg-gray-300" />
          )}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {author.displayName ?? author.handle}{" "}
            <span className="text-gray-500">@{author.handle}</span>
          </p>
        </a>
        <a
          href={`https://bsky.app/profile/${author.did}/post/${comment.post.uri
            .split("/")
            .pop()}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <p>{comment.post.record.text as unknown as ReactNode}</p>
          <Actions post={comment.post} />
        </a>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-[#525252] pl-2">
          {comment.replies.sort(sortByLikes).map((reply) => {
            if (!isThreadViewPost(reply)) {
              return null;
            }
            return (
              <Comment key={reply.post.uri} comment={reply} filters={filters} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Actions({ post }: { post: AppBskyFeedDefs.PostView }): ReactNode {
  return (
    <div className="mt-2 flex w-full max-w-[150px] flex-row items-center justify-between opacity-60">
      <div className="flex items-center gap-1">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <title>Replies</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
          />
        </svg>
        <p className="text-xs">{post.replyCount ?? 0}</p>
      </div>
      <div className="flex items-center gap-1">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <title>Reposts</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
          />
        </svg>
        <p className="text-xs">{post.repostCount ?? 0}</p>
      </div>
      <div className="flex items-center gap-1">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <title>Likes</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <p className="text-xs">{post.likeCount ?? 0}</p>
      </div>
    </div>
  );
}

function sortByLikes(a: unknown, b: unknown): number {
  if (!isThreadViewPost(a) || !isThreadViewPost(b)) {
    return 0;
  }
  return (
    ((b as AppBskyFeedDefs.ThreadViewPost).post.likeCount ?? 0) -
    ((a as AppBskyFeedDefs.ThreadViewPost).post.likeCount ?? 0)
  );
}

export function MinLikeCountFilter(
  min: number,
): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return (comment.post.likeCount ?? 0) < min;
  };
}

export function MinCharacterCountFilter(
  min: number,
): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!isRecord(comment.post.record)) {
      return false;
    }
    return (comment.post.record.text as unknown as string).length < min;
  };
}

export function TextContainsFilter(
  text: string,
): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!isRecord(comment.post.record)) {
      return false;
    }
    return (comment.post.record.text as unknown as string)
      .toLowerCase()
      .includes(text.toLowerCase());
  };
}

export function ExactMatchFilter(
  text: string,
): (comment: AppBskyFeedDefs.ThreadViewPost) => boolean {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!isRecord(comment.post.record)) {
      return false;
    }
    return (
      (comment.post.record.text as unknown as string).toLowerCase() ===
      text.toLowerCase()
    );
  };
}

export let baseFilters: Record<string, PlainFilter> = {
  NoLikes: MinLikeCountFilter(0),
  NoPins: ExactMatchFilter("📌"),
};

type PostSummaryProps = {
  postUrl: string;
  post: AppBskyFeedDefs.PostView;
};

export function PostSummary({ postUrl, post }: PostSummaryProps): ReactNode {
  return (
    <div className="max-w-[740px] mx-auto">
      <a
        className="flex flex-row justify-start items-center gap-2 hover:underline"
        href={postUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span className="flex items-center gap-1 whitespace-nowrap">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="pink"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="pink"
            color="pink"
          >
            <title>Likes</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span>{post.likeCount ?? 0} likes</span>
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="green"
          >
            <title>Reposts</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>
          <span>{post.repostCount ?? 0} reposts</span>
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="#7FBADC"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#7FBADC"
          >
            <title>Replies</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          <span>{post.replyCount ?? 0} replies</span>
        </span>
      </a>
      <h2 className="mt-6 text-xl font-bold">Comments</h2>
      <p className="mt-2 text-sm">
        Join the conversation by{" "}
        <a
          className="underline hover:underline"
          href={postUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          replying on bsky
        </a>
        .
      </p>
    </div>
  );
}

function getAtUri(uri: string): string {
  if (!uri.startsWith("at://") && uri.includes("bsky.app/profile/")) {
    let match = uri.match(/profile\/([\w.]+)\/post\/([\w]+)/);
    if (match) {
      let [, did, postId] = match;
      return `at://${did}/app.bsky.feed.post/${postId}`;
    }
  }
  return uri;
}

export function CommentSection({
  uri: propUri,
  author,
  onEmpty,
  commentFilters,
}: CommentOptions): ReactNode {
  let [uri, setUri] = useState<string | null>(propUri ?? null);
  let [thread, setThread] = useState<AppBskyFeedDefs.ThreadViewPost | null>(
    null,
  );
  let [error, setError] = useState<string | null>(null);
  let [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (propUri) {
      setUri(propUri);
      return;
    }

    if (author) {
      let fetchPost = async () => {
        let currentUrl = window.location.href;
        let apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=*&url=${encodeURIComponent(
          currentUrl,
        )}&author=${author}&sort=top`;
        try {
          let response = await fetch(apiUrl);
          let data = await response.json();

          if (data.posts && data.posts.length > 0) {
            let post = data.posts[0];
            setUri(post.uri);
          } else {
            setError("No matching post found");
            onEmpty?.({ code: "not_found", message: "No matching post found" });
          }
        } catch (err) {
          setError("Error fetching post");
          onEmpty?.({ code: "fetching_error", message: "Error fetching post" });
        }
      };

      fetchPost();
    }
  }, [propUri, author, onEmpty]);

  useEffect(() => {
    if (uri) {
      let fetchThreadData = async () => {
        try {
          let thread = await getPostThread(uri);
          setThread(thread);
        } catch (err) {
          setError("Error loading comments");
          onEmpty?.({
            code: "comment_loading_error",
            message: "Error loading comments",
          });
        }
      };

      fetchThreadData();
    }
  }, [uri, onEmpty]);

  if (!uri) {
    return null;
  }

  if (error) {
    return <p className="text-center">{error}</p>;
  }

  if (!thread) {
    return <p className="text-center">Loading comments...</p>;
  }

  function showMore() {
    setVisibleCount((prevCount) => prevCount + 5);
  }

  let postUrl: string = uri;
  if (uri.startsWith("at://")) {
    let [, , did, _, rkey] = uri.split("/");
    postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;
  }

  if (!thread.replies || thread.replies.length === 0) {
    return (
      <div className="max-w-[740px] mx-auto">
        <PostSummary postUrl={postUrl} post={thread.post} />
      </div>
    );
  }
  let sortedReplies = thread.replies.sort(sortByLikes);

  return (
    <div className="max-w-[740px] mx-auto">
      <PostSummary postUrl={postUrl} post={thread.post} />
      <hr className="mt-2" />
      <div className="mt-2 flex flex-col gap-2">
        {sortedReplies.slice(0, visibleCount).map((reply) => {
          if (!isThreadViewPost(reply)) return null;
          return (
            <Comment
              key={reply.post.uri}
              comment={reply}
              filters={commentFilters}
            />
          );
        })}
        {visibleCount < sortedReplies.length && (
          <button
            type="button"
            onClick={showMore}
            className="mt-2 text-sm underline hover:underline"
          >
            Show more comments
          </button>
        )}
      </div>
    </div>
  );
}

async function getPostThread(
  uri: string,
): Promise<AppBskyFeedDefs.ThreadViewPost> {
  let atUri = getAtUri(uri);
  let params = new URLSearchParams({ uri: atUri });

  let res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch post thread");
  }

  let data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!isThreadViewPost(data.thread)) {
    throw new Error("Could not find thread");
  }

  return data.thread;
}
