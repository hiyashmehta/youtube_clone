import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
	void trpc.categories.getMany.prefetch()

	return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
          <PageClient />
      </ErrorBoundary>
      </Suspense>
    </HydrateClient>
	);
}
