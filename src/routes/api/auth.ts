import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { keyword } = await request.json();
        const key = (keyword ?? "").trim().toLowerCase();
        if (key === "nirdan") return Response.json({ user: "nirdan" });
        if (key === "hribil") return Response.json({ user: "hribil" });
        return Response.json({ error: "Invalid keyword" }, { status: 401 });
      },
    },
  },
});
