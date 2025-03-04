"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
          <h2>Something went wrong!</h2>
          <p className="text-balance text-center text-sm/6">{error.message}</p>
          <div className="grid grid-cols-2 items-center justify-center gap-2">
            <a
              className="h-9 flex-1 items-center justify-center text-nowrap rounded-md border border-border bg-gray-300 px-4 py-2 text-sm dark:text-black"
              href="https://github.com/Axyl1410/Generative-Hub-App"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report Error on GitHub
            </a>
            <Button
              className="bg-sky-500 hover:bg-sky-600"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
