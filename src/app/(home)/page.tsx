import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
	try {
		await trpc.hello.prefetch({ text: "Yash" });
	} catch (error) {
		console.error("Error during prefetch:", error);
		// Handle the error appropriately, e.g., set a fallback state
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<HydrateClient>
				<ErrorBoundary fallback={<div>Error...</div>}>
					<PageClient />
				</ErrorBoundary>
			</HydrateClient>
		</Suspense>
	);
}
