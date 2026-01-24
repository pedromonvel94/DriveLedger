import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        return Response.json({respuesta:"ok"});
    } catch (e) {
        return Response.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Database error" } }, { status: 500 });
    }
}