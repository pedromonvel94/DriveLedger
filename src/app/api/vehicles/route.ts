import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        var url = new URL(request.url);
        var userId = url.searchParams.get("userId");
        return Response.json({ user_id: userId });
    } catch (e) {
        return Response.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Database error" } }, { status: 500 });
    }
}

export async function POST() {
}