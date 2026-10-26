"use bun";

import { ArrowLeft, CheckCircle2, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "swift-rust/link";
import { useActionData, useLoaderData } from "swift-rust/router";
import { CopyButton } from "@/components/copy-button";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type action from "./action";
import type loader from "./loader";

export const metadata = { title: "Bookmark" };

const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export default function BookmarkPage() {
  const { bookmark } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const saved = result && "saved" in result;
  const error =
    result && "error" in result && typeof result.error === "string"
      ? result.error
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to crate
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {bookmark.title}
          </h1>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {bookmark.url}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <CopyButton value={bookmark.url} />
          <Button asChild size="sm" variant="outline">
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              Open <ExternalLink />
            </a>
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Saved {dateFormat.format(new Date(bookmark.createdAt))} UTC ·{" "}
        {bookmark.read ? (
          <span className="text-emerald-600 dark:text-emerald-400">Read</span>
        ) : (
          "Unread"
        )}
      </p>

      {saved && <Alert className="mt-6">Changes saved.</Alert>}
      {error && (
        <Alert variant="destructive" className="mt-6">
          {error}
        </Alert>
      )}

      <Card className="mt-6">
        <CardContent>
          <form method="post" className="grid gap-4">
            <input type="hidden" name="intent" value="save" />
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={bookmark.title}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={bookmark.tags.join(", ")}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                rows={5}
                defaultValue={bookmark.note}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <div className="flex flex-wrap gap-2">
        <form method="post">
          <input type="hidden" name="intent" value="toggle" />
          <Button type="submit" variant="secondary">
            <CheckCircle2 /> Mark as {bookmark.read ? "unread" : "read"}
          </Button>
        </form>
        <form method="post">
          <input type="hidden" name="intent" value="delete" />
          <Button type="submit" variant="destructive">
            <Trash2 /> Delete
          </Button>
        </form>
      </div>
    </div>
  );
}
