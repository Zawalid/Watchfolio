"use client";

import { Button } from "@heroui/button";
import Image from "next/image";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[500px] flex-1 flex-col items-center justify-center gap-1 text-center">
      <div className="relative aspect-square w-1/2 h-60 xl:h-72">
        <Image src="/images/error.svg" alt="" fill />
      </div>
      <h2 className="text-Grey/50 text-2xl font-semibold sm:text-3xl">
        Sorry, Something went wrong
      </h2>
      <p className="text-Grey/300 font-medium">{error.message}</p>
      <Button color="primary" size="lg" onPress={reset}>Try again</Button>
    </div>
  );
}
