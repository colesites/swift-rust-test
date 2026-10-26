import { type LoaderContext, notFound } from "swift-rust/router";
import { getBookmark } from "@/lib/store";

export default function loader({ params }: LoaderContext<{ id: string }>) {
  const bookmark = getBookmark(params.id);
  if (!bookmark) notFound(`No bookmark with id "${params.id}"`);
  return { bookmark };
}
