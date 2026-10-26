import type { RouteHandler } from "swift-rust/router";
import { addBookmark, type BookmarkInput, listBookmarks } from "@/lib/store";

// GET /api/bookmarks?tag=rust&q=book&status=unread
export const GET: RouteHandler = ({ query }) =>
  Response.json({
    data: listBookmarks({ tag: query.tag, q: query.q, status: query.status }),
  });

// POST /api/bookmarks  { "url": "...", "title"?: "...", "tags"?: "a, b", "note"?: "..." }
export const POST: RouteHandler = ({ body }) => {
  const input = body as Partial<BookmarkInput> | null;
  if (!input || typeof input !== "object" || typeof input.url !== "string") {
    return Response.json(
      { error: "Body must be JSON with a string `url`." },
      { status: 400 },
    );
  }
  const result = addBookmark(input as BookmarkInput);
  if (!result.ok)
    return Response.json({ errors: result.errors }, { status: 422 });
  return Response.json({ data: result.bookmark }, { status: 201 });
};
