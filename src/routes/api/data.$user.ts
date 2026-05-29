import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../../db/index.js";
import { nirdanData, hribilData } from "../../../db/schema.js";
import { eq } from "drizzle-orm";

async function getOrCreate(user: "nirdan" | "hribil") {
  const table = user === "nirdan" ? nirdanData : hribilData;
  let rows = await db.select().from(table).limit(1);
  if (rows.length === 0) {
    const [row] = await db.insert(table).values({}).returning();
    return row;
  }
  return rows[0];
}

export const Route = createFileRoute("/api/data/$user")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const user = params.user as "nirdan" | "hribil";
        if (user !== "nirdan" && user !== "hribil") {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
        const row = await getOrCreate(user);
        return Response.json(row);
      },

      PUT: async ({ request, params }) => {
        const user = params.user as "nirdan" | "hribil";
        if (user !== "nirdan" && user !== "hribil") {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
        const { giftIdea, importantDate } = await request.json();
        const table = user === "nirdan" ? nirdanData : hribilData;
        const row = await getOrCreate(user);
        const [updated] = await db
          .update(table)
          .set({
            giftIdea: giftIdea ?? row.giftIdea,
            importantDate: importantDate ?? row.importantDate,
            updatedAt: new Date(),
          })
          .where(eq(table.id, row.id))
          .returning();
        return Response.json(updated);
      },
    },
  },
});
