"use client";

import { usePathname, useRouter, useSearchParams as useSp } from "next/navigation";

export const useSearchParams = () => {
  const searchParams = useSp();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (
    key: string | Record<string, string>,
    value?: string | null,
    delete_condition?: boolean
  ) => {
    let params;
    if (typeof key === "object") {
      const filtered = Object.entries(key).filter(([, value]) => value);
      params = new URLSearchParams(filtered);
    } else {
      params = new URLSearchParams(searchParams);
      if (!value || delete_condition) params.delete(key);
      else params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { searchParams, setSearchParams };
};
