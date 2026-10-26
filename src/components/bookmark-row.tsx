import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Link } from "swift-rust/link";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/lib/store";

function host(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

export function BookmarkRow({ bookmark }: { bookmark: Bookmark }) {
  return (
    <li className="group flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/20">
      <form method="post" className="pt-0.5">
        <input type="hidden" name="intent" value="toggle" />
        <input type="hidden" name="id" value={bookmark.id} />
        <button
          type="submit"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label={bookmark.read ? "Mark as unread" : "Mark as read"}
          title={bookmark.read ? "Mark as unread" : "Mark as read"}
        >
          {bookmark.read ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : (
            <Circle className="size-5" />
          )}
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Link
            href={`/b/${bookmark.id}`}
            className={`truncate font-medium hover:underline ${bookmark.read ? "text-muted-foreground line-through decoration-1" : ""}`}
          >
            {bookmark.title}
          </Link>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            className="truncate text-xs text-muted-foreground hover:text-foreground"
          >
            {host(bookmark.url)} ↗
          </a>
        </div>
        {bookmark.note && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {bookmark.note}
          </p>
        )}
        {bookmark.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bookmark.tags.map((t) => (
              <a key={t} href={`/?tag=${encodeURIComponent(t)}`}>
                <Badge variant="secondary" size="sm">
                  #{t}
                </Badge>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <CopyButton value={bookmark.url} />
        <form method="post">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="id" value={bookmark.id} />
          <Button
            type="submit"
            size="icon-sm"
            variant="ghost"
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 className="text-destructive" />
          </Button>
        </form>
      </div>
    </li>
  );
}
