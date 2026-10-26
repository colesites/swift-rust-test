import type { LoaderContext } from "swift-rust/router";
import { allTags, listBookmarks, stats } from "@/lib/store";

type Search = { tag?: string; q?: string; status?: string };

export default function loader({
  searchParams,
}: LoaderContext<Record<string, string>, Search>) {
  const filter = {
    tag: searchParams.tag || undefined,
    q: searchParams.q || undefined,
    status: searchParams.status || "all",
  };
  return {
    filter,
    bookmarks: listBookmarks(filter),
    tags: allTags(),
    stats: stats(),
  };
}
