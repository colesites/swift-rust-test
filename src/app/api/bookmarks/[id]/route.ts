import type { RouteHandler } from "swift-rust/router";
import {
  deleteBookmark,
  getBookmark,
  parseTags,
  updateBookmark,
} from "@/lib/store";

type Params = { id: string };

const missing = (id: string) =>
  Response.json({ error: `No bookmark with id "${id}"` }, { status: 404 });

export const GET: RouteHandler<Params> = ({ params }) => {
  const bookmark = getBookmark(params.id);
  return bookmark ? Response.json({ data: bookmark }) : missing(params.id);
};

// PATCH /api/bookmarks/:id  { "read"?: boolean, "title"?: string, "note"?: string, "tags"?: "a, b" }
export const PATCH: RouteHandler<Params> = ({ params, body }) => {
  const input = (body ?? {}) as {
    read?: unknown;
    title?: unknown;
    note?: unknown;
    tags?: unknown;
  };
  const patch: Parameters<typeof updateBookmark>[1] = {};
  if (typeof input.read === "boolean") patch.read = input.read;
  if (typeof input.title === "string" && input.title.trim())
    patch.title = input.title.trim();
  if (typeof input.note === "string") patch.note = input.note.trim();
  if (typeof input.tags === "string") patch.tags = parseTags(input.tags);
  const bookmark = updateBookmark(params.id, patch);
  return bookmark ? Response.json({ data: bookmark }) : missing(params.id);
};

export const DELETE: RouteHandler<Params> = ({ params }) =>
  deleteBookmark(params.id)
    ? new Response(null, { status: 204 })
    : missing(params.id);
