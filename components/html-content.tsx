"use client";

import { useEffect, useState } from "react";

interface HtmlContentProps {
  content: string;
}

export function HtmlContent({ content }: HtmlContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse h-40 bg-muted rounded-md" />;
  }

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
