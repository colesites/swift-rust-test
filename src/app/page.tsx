"use bun";

import { Bookmark as BookmarkIcon, Plus, Search } from "lucide-react";
import { useActionData, useLoaderData } from "swift-rust/router";
import { BookmarkRow } from "@/components/bookmark-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type action from "./action";
import type loader from "./loader";

export const metadata = { title: "Your crate" };

const STATUSES = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function hrefWith(
  filter: { tag?: string; q?: string; status?: string },
  patch: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...filter, ...patch })) {
    if (v && !(k === "status" && v === "all")) params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default function Home() {
  const { bookmarks, tags, stats, filter } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const failed = actionData && "errors" in actionData ? actionData : undefined;
  const progress = stats.total
    ? Math.round((stats.read / stats.total) * 100)
    : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav
            className="inline-flex rounded-lg border border-border p-0.5 text-sm"
            aria-label="Filter by status"
          >
            {STATUSES.map((s) => (
              <a
                key={s.value}
                href={hrefWith(filter, { status: s.value })}
                aria-current={filter.status === s.value ? "page" : undefined}
                className="rounded-md px-3 py-1 text-muted-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <form
            method="get"
            className="relative sm:w-64"
            aria-label="Search bookmarks"
          >
            {filter.tag && (
              <input type="hidden" name="tag" value={filter.tag} />
            )}
            {filter.status !== "all" && (
              <input type="hidden" name="status" value={filter.status} />
            )}
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={filter.q ?? ""}
              placeholder="Search links…"
              className="pl-8"
              aria-label="Search"
            />
          </form>
        </div>

        {filter.tag && (
          <p className="mb-4 text-sm text-muted-foreground">
            Tagged{" "}
            <span className="font-medium text-foreground">#{filter.tag}</span> ·{" "}
            <a
              href={hrefWith(filter, { tag: undefined })}
              className="underline underline-offset-4 hover:text-foreground"
            >
              clear
            </a>
          </p>
        )}

        {bookmarks.length === 0 ? (
          <Empty className="rounded-lg border border-dashed border-border py-16">
            <EmptyMedia>
              <BookmarkIcon className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Nothing here</EmptyTitle>
            <EmptyDescription>
              {filter.q || filter.tag || filter.status !== "all"
                ? "No links match these filters."
                : "Save your first link with the form on the right."}
            </EmptyDescription>
          </Empty>
        ) : (
          <ul className="grid gap-2">
            {bookmarks.map((b) => (
              <BookmarkRow key={b.id} bookmark={b} />
            ))}
          </ul>
        )}
      </section>

      <aside className="grid content-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Save a link</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="post" className="grid gap-3">
              <input type="hidden" name="intent" value="add" />
              <div className="grid gap-1.5">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  required
                  placeholder="https://…"
                  defaultValue={failed?.values.url}
                  variant={failed?.errors.url ? "destructive" : "default"}
                  aria-invalid={failed?.errors.url ? true : undefined}
                  aria-describedby={
                    failed?.errors.url ? "url-error" : undefined
                  }
                />
                {failed?.errors.url && (
                  <p id="url-error" className="text-xs text-destructive">
                    {failed.errors.url}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="title">
                  Title{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={failed?.values.title}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tags">
                  Tags{" "}
                  <span className="text-muted-foreground">
                    (comma separated)
                  </span>
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="rust, reading"
                  defaultValue={failed?.values.tags}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  name="note"
                  rows={3}
                  defaultValue={failed?.values.note}
                />
              </div>
              <Button type="submit" className="mt-1">
                <Plus /> Save link
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="grid gap-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Read</span>
              <span className="font-medium tabular-nums">
                {stats.read} / {stats.total}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reading progress"
            >
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map(({ tag, count }) => (
                  <a
                    key={tag}
                    href={hrefWith(filter, {
                      tag: filter.tag === tag ? undefined : tag,
                    })}
                    aria-current={filter.tag === tag ? "true" : undefined}
                    className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground aria-[current=true]:border-foreground aria-[current=true]:text-foreground"
                  >
                    #{tag}{" "}
                    <span className="tabular-nums opacity-60">{count}</span>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
