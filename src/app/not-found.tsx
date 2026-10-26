import { Link } from "swift-rust/link";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">That link isn't in your crate.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm underline underline-offset-4"
        >
          ← Back to crate
        </Link>
      </div>
    </div>
  );
}
