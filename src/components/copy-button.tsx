"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Island: server-rendered as a plain button, hydrated in the browser.
// Props must be JSON-serializable to cross the island boundary.
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={copied ? "Copied" : "Copy link"}
      title={copied ? "Copied" : "Copy link"}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="text-emerald-500" /> : <Copy />}
    </Button>
  );
}
