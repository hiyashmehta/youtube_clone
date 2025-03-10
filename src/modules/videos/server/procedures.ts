import { db } from "@/db";
import { z } from "zod";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

export const videosRouter = createTRPCRouter({
    remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;

        const [removedVideo] = await db
            .delete(videos)
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            ))
            .returning();

            if (!removedVideo) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return removedVideo;
    }),

    update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;

        if(!input.id) {
            throw new TRPCError({ code: "BAD_REQUEST" });
        }

        const [updatedVideo] = await db
            .update(videos)
            .set({
                title: input.title,
                description: input.description,
                categoryId: input.categoryId,
                visibility: input.visibility,
                updatedAt: new Date(),
            })
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId),
            ))
            .returning();

            if (!updatedVideo) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return updatedVideo;
    }),
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        // throw new TRPCError({ code: "BAD_REQUEST", message: "Not implemented" });

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ["public"],
                mp4_support: "standard",
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: "en",
                                name: "English",
                            },
                        ],
                    },
                ],
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