import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  note: string;
  tags: string[];
  read: boolean;
  createdAt: string;
}

// Route modules are re-imported per request in dev, so state lives on disk
// rather than in module memory. `.data/` is git-ignored.
const DATA_DIR = join(process.cwd(), ".data");
const DATA_FILE = join(DATA_DIR, "crate.json");

const SEED: Bookmark[] = [
  {
    id: "rust-book",
    url: "https://doc.rust-lang.org/book/",
    title: "The Rust Programming Language",
    note: "Ownership and borrowing chapters first.",
    tags: ["rust", "learning"],
    read: false,
    createdAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "react-19",
    url: "https://react.dev/blog/2024/12/05/react-19",
    title: "React 19 release notes",
    note: "Actions, useOptimistic, and the new form APIs.",
    tags: ["react"],
    read: true,
    createdAt: "2026-10-22T14:30:00.000Z",
  },
  {
    id: "bun-docs",
    url: "https://bun.sh/docs",
    title: "Bun documentation",
    note: "",
    tags: ["bun", "tooling"],
    read: false,
    createdAt: "2026-10-25T18:15:00.000Z",
  },
];

function load(): Bookmark[] {
  if (!existsSync(DATA_FILE)) {
    save(SEED);
    return [...SEED];
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Bookmark[];
  } catch {
    return [];
  }
}

function save(items: Bookmark[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function listBookmarks(
  filter: { tag?: string; q?: string; status?: string } = {},
): Bookmark[] {
  const q = filter.q?.trim().toLowerCase();
  return load()
    .filter((b) => !filter.tag || b.tags.includes(filter.tag))
    .filter((b) => filter.status !== "unread" || !b.read)
    .filter((b) => filter.status !== "read" || b.read)
    .filter(
      (b) =>
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.note.toLowerCase().includes(q),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBookmark(id: string): Bookmark | undefined {
  return load().find((b) => b.id === id);
}

export function allTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const b of load())
    for (const t of b.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function stats() {
  const items = load();
  const read = items.filter((b) => b.read).length;
  return { total: items.length, read, unread: items.length - read };
}

export interface BookmarkInput {
  url: string;
  title?: string;
  note?: string;
  tags?: string;
}

export type ValidationResult =
  | { ok: true; bookmark: Bookmark }
  | { ok: false; errors: Partial<Record<keyof BookmarkInput, string>> };

export function parseTags(raw: string | undefined): string[] {
  return [
    ...new Set(
      (raw ?? "")
        .split(",")
        .map((t) =>
          t
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, ""),
        )
        .filter(Boolean),
    ),
  ];
}

export function addBookmark(input: BookmarkInput): ValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(input.url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      throw new Error();
  } catch {
    return { ok: false, errors: { url: "Enter a full http(s) URL." } };
  }
  const items = load();
  if (items.some((b) => b.url === parsed.href)) {
    return {
      ok: false,
      errors: { url: "That link is already in your crate." },
    };
  }
  const bookmark: Bookmark = {
    id: crypto.randomUUID().slice(0, 8),
    url: parsed.href,
    title: input.title?.trim() || parsed.hostname.replace(/^www\./, ""),
    note: input.note?.trim() ?? "",
    tags: parseTags(input.tags),
    read: false,
    createdAt: new Date().toISOString(),
  };
  save([bookmark, ...items]);
  return { ok: true, bookmark };
}

export function updateBookmark(
  id: string,
  patch: Partial<Omit<Bookmark, "id">>,
): Bookmark | undefined {
  const items = load();
  const i = items.findIndex((b) => b.id === id);
  const current = items[i];
  if (!current) return undefined;
  const next = { ...current, ...patch };
  items[i] = next;
  save(items);
  return next;
}

export function deleteBookmark(id: string): boolean {
  const items = load();
  const next = items.filter((b) => b.id !== id);
  save(next);
  return next.length !== items.length;
}
