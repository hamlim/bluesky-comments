/// <reference lib="dom" />
import {
  AppBskyFeedDefs,
  type AppBskyFeedGetPostThread,
  AppBskyFeedPost,
} from "@atproto/api";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type CommentProps = {
  comment: AppBskyFeedDefs.ThreadViewPost;
  filters?: Array<(arg: any) => boolean>;
};

export interface CommentEmptyDetails {
  code: string;
  message: string;
}

export interface CommentOptions {
  uri?: string;
  author?: string;
  commentFilters?: Array<(arg: any) => boolean>;
  onEmpty?: (details: CommentEmptyDetails) => void;
}

export function Comment({ comment, filters }: CommentProps): ReactNode {
  let author = comment.post.author;
  let avatarClassName = "bsky-comments-avatar";

  if (!AppBskyFeedPost.isRecord(comment.post.record)) {
    return null;
  }
  // filter out replies that match any of the commentFilters, by ensuring they all return false
  if (filters && !filters.every((filter) => !filter(comment))) {
    return null;
  }

  return (
    <div className="bsky-comments-commentContainer">
      <div className="bsky-comments-commentContent">
        <a
          className="bsky-comments-authorLink"
          href={`https://bsky.app/profile/${author.did}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {author.avatar ? (
            <img
              src={comment.post.author.avatar}
              alt="avatar"
              className={avatarClassName}
            />
          ) : (
            <div className={avatarClassName} />
          )}
          <p className="bsky-comments-authorName">
            {author.displayName ?? author.handle}{" "}
            <span className="bsky-comments-handle">@{author.handle}</span>
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
        <div className="bsky-comments-repliesContainer">
          {comment.replies.sort(sortByLikes).map((reply) => {
            if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
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
    <div className="bsky-comments-actionsContainer">
      <div className="bsky-comments-actionsRow">
        <svg
          className="bsky-comments-icon"
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
      <div className="bsky-comments-actionsRow">
        <svg
          className="bsky-comments-icon"
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
      <div className="bsky-comments-actionsRow">
        <svg
          className="bsky-comments-icon"
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
  if (
    !AppBskyFeedDefs.isThreadViewPost(a) ||
    !AppBskyFeedDefs.isThreadViewPost(b)
  ) {
    return 0;
  }
  return (
    ((b as AppBskyFeedDefs.ThreadViewPost).post.likeCount ?? 0) -
    ((a as AppBskyFeedDefs.ThreadViewPost).post.likeCount ?? 0)
  );
}

let MinLikeCountFilter = (
  min: number,
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    return (comment.post.likeCount ?? 0) < min;
  };
};

let MinCharacterCountFilter = (
  min: number,
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!AppBskyFeedPost.isRecord(comment.post.record)) {
      return false;
    }
    return (comment.post.record.text as unknown as string).length < min;
  };
};

let TextContainsFilter = (
  text: string,
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!AppBskyFeedPost.isRecord(comment.post.record)) {
      return false;
    }
    return (comment.post.record.text as unknown as string)
      .toLowerCase()
      .includes(text.toLowerCase());
  };
};

let ExactMatchFilter = (
  text: string,
): ((comment: AppBskyFeedDefs.ThreadViewPost) => boolean) => {
  return (comment: AppBskyFeedDefs.ThreadViewPost) => {
    if (!AppBskyFeedPost.isRecord(comment.post.record)) {
      return false;
    }
    return (
      (comment.post.record.text as unknown as string).toLowerCase() ===
      text.toLowerCase()
    );
  };
};

export let Filters = {
  MinLikeCountFilter,
  MinCharacterCountFilter,
  TextContainsFilter,
  ExactMatchFilter,
  NoLikes: MinLikeCountFilter(0),
  NoPins: ExactMatchFilter("📌"),
};

type PostSummaryProps = {
  postUrl: string;
  post: AppBskyFeedDefs.PostView;
};

export function PostSummary({ postUrl, post }: PostSummaryProps): ReactNode {
  return (
    <>
      <a href={postUrl} target="_blank" rel="noreferrer noopener">
        <p className="bsky-comments-statsBar">
          <span className="bsky-comments-statItem">
            <svg
              className="bsky-comments-icon"
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
          <span className="bsky-comments-statItem">
            <svg
              className="bsky-comments-icon"
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
          <span className="bsky-comments-statItem">
            <svg
              className="bsky-comments-icon"
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
        </p>
      </a>
      <h2 className="bsky-comments-commentsTitle">Comments</h2>
      <p className="bsky-comments-replyText">
        Join the conversation by{" "}
        <a
          className="bsky-comments-link"
          href={postUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          replying on bsky
        </a>
        .
      </p>
    </>
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
  let [uri, setUri] = useState<string | null>(null);
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
    return <p className="bsky-comments-errorText">{error}</p>;
  }

  if (!thread) {
    return <p className="bsky-comments-loadingText">Loading comments...</p>;
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
      <div className="bsky-comments-container">
        <PostSummary postUrl={postUrl} post={thread.post} />
      </div>
    );
  }
  let sortedReplies = thread.replies.sort(sortByLikes);

  return (
    <div className="bsky-comments-container">
      <PostSummary postUrl={postUrl} post={thread.post} />
      <hr className="bsky-comments-divider" />
      <div className="bsky-comments-commentsList">
        {sortedReplies.slice(0, visibleCount).map((reply) => {
          if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
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
            className="bsky-comments-showMoreButton"
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

  if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
    throw new Error("Could not find thread");
  }

  return data.thread;
}
