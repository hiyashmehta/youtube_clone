import { db } from "@/db";
import { z } from "zod";
import { subscriptions, users, videoReactions, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { mux } from "@/lib/mux";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";

export const usersRouter = createTRPCRouter({
    getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx  }) => {
        const { clerkUserId } = ctx;

        let userId;

        const [user] = await db
            .select()
            .from(users)
            .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

        if(user) {
            userId = user.id;
        }
        
        const viewerReactions = db.$with("viewer_reactions").as(
            db
                .select({
                    videoId: videoReactions.videoId,
                    type: videoReactions.type,
                })
                .from(videoReactions)
                .where(inArray(videoReactions.userId, userId ? [userId] : []))
        );

        const viewerSubscriptions = db.$with("viewer_subscriptions").as(
            db
                .select()
                .from(subscriptions)
                .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
        )

        const [existingVideo] = await db
            .with(viewerReactions, viewerSubscriptions)
            .select({
                ...getTableColumns(videos),
                user: {
                    ...getTableColumns(users),
                    subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)), 
                    viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
                },
                viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
                likeCount: db.$count(
                    videoReactions,
                    and(
                        eq(videoReactions.videoId, videos.id),
                        eq(videoReactions.type, "like"),
                    ),
                ),
                dislikeCount: db.$count(
                    videoReactions,
                    and(
                        eq(videoReactions.videoId, videos.id),
                        eq(videoReactions.type, "dislike"),
                    ),
                ),
                viewerReaction: viewerReactions.type
            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(eq(videos.id, input.id))
            // .groupBy(
            //     videos.id,
            //     users.id,
            //     viewerReactions.type,
            // )
            ;

        if(!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        return existingVideo;
    }),
});