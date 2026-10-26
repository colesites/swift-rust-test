import type { ActionContext, RouteControl } from "swift-rust/router";
import {
  deleteBookmark,
  getBookmark,
  parseTags,
  updateBookmark,
} from "@/lib/store";

export default async function action({
  formData,
  params,
}: ActionContext<{ id: string }>): Promise<
  RouteControl | { saved: true } | { error: string }
> {
  const form = await formData();
  const intent = String(form.get("intent") ?? "");
  const current = getBookmark(params.id);
  if (!current) return { kind: "notFound" };

  if (intent === "delete") {
    deleteBookmark(params.id);
    return { kind: "redirect", to: "/", status: 303 };
  }
  if (intent === "toggle") {
    updateBookmark(params.id, { read: !current.read });
    return { kind: "redirect", to: `/b/${params.id}`, status: 303 };
  }
  if (intent === "save") {
    const title = String(form.get("title") ?? "").trim();
    if (!title) return { error: "Title can't be empty." };
    updateBookmark(params.id, {
      title,
      note: String(form.get("note") ?? "").trim(),
      tags: parseTags(String(form.get("tags") ?? "")),
    });
    return { saved: true };
  }
  return { error: `Unknown intent "${intent}"` };
}
