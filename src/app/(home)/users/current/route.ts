import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const GET = async () => {
    const { userid } = await auth();

    if(!userid) {
        return redirect("/sign-in");
    }

    const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userid));

    if(!existingUser) {
        return redirect('/sign-in');
    }

    return redirect(`/users/${existingUser.id}`);
}