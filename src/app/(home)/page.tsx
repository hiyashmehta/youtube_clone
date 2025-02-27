import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  void trpc.hello.prefetch({ text: "Yash" });

  return (
   <HydrateClient>
    <Suspense fallback={<>Loading...</>}>
    <ErrorBoundary fallback={<>Error...</>}>
      <PageClient/>
    </ErrorBoundary>
    </Suspense>
   </HydrateClient>
  );
};