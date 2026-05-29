import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../db/index.js";
import { nirdanData, hribilData } from "../../../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const Route = createFileRoute("/api/love/$user")({
  server: {
    handlers: {
      POST: async ({ params }) => {
        const user = params.user as "nirdan" | "hribil";
        if (user !== "nirdan" && user !== "hribil") {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
        const table = user === "nirdan" ? nirdanData : hribilData;
        let rows = await db.select().from(table).limit(1);
        if (rows.length === 0) {
          const [row] = await db.insert(table).values({}).returning();
          rows = [row];
        }
        const [updated] = await db
          .update(table)
          .set({ loveCount: sql`${table.loveCount} + 1` })
          .where(eq(table.id, rows[0].id))
          .returning();
        return Response.json({ loveCount: updated.loveCount });
      },
    },
  },
});
