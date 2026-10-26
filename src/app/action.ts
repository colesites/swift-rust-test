import type { ActionContext, RouteControl } from "swift-rust/router";
import {
  addBookmark,
  deleteBookmark,
  getBookmark,
  updateBookmark,
} from "@/lib/store";

// Plain <form method="post"> submissions land here, so every mutation works
// without client JS. Successful writes redirect (POST → 303 → GET) so a refresh
// never resubmits; validation failures return data for useActionData().
export default async function action({
  formData,
  url,
}: ActionContext): Promise<
  | RouteControl
  | { errors: Record<string, string>; values: Record<string, string> }
> {
  const form = await formData();
  const intent = String(form.get("intent") ?? "");
  const back = {
    kind: "redirect",
    to: url.pathname + url.search,
    status: 303,
  } as const;

  if (intent === "add") {
    const values = {
      url: String(form.get("url") ?? ""),
      title: String(form.get("title") ?? ""),
      tags: String(form.get("tags") ?? ""),
      note: String(form.get("note") ?? ""),
    };
    const result = addBookmark(values);
    if (!result.ok)
      return { errors: result.errors as Record<string, string>, values };
    return back;
  }

  const id = String(form.get("id") ?? "");
  if (intent === "toggle") {
    const current = getBookmark(id);
    if (current) updateBookmark(id, { read: !current.read });
    return back;
  }
  if (intent === "delete") {
    deleteBookmark(id);
    return back;
  }
  return {
    kind: "error",
    error: new Error(`Unknown intent "${intent}"`),
    status: 400,
  };
}
