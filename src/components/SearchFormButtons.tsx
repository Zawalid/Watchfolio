"use client";

import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className={`h-auto ${pending ? "flex items-center gap-1" : ""}`}
      type="submit"
      color="primary"
      size="md"
      isLoading={pending}
    >
      {pending ? "Searching..." : "Search"}
    </Button>
  );
}

export function ResetButton() {
  const pathname = usePathname();

  return (
    <button
      className="absolute z-20 right-4 top-1/2 -translate-y-1/2 icon"
      type="reset"
      onClick={() => {
        const form = document.getElementById("search-form") as HTMLFormElement;
        if (form) form.reset();
      }}
    >
      <Link href={pathname}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </Link>
    </button>
  );
}
