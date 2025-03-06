import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        // throw new TRPCError({ code: "BAD_REQUEST", message: "Not implemented" });

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ["public"],
                mp4_support: "standard",
            },
            cors_origin: '*',
        });

        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: "untitled",
                muxStatus: "waiting",
                muxUploadId: upload.id,
            })
            .returning();

            return {
                video: video,
                url: upload.url,
            };
    }),
});