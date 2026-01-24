import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userIdParam = url.searchParams.get("userId");

        if (userIdParam === null) {
            return Response.json({ error: "userId is required" }, { status: 400 });
        }

        const userId = parseInt(userIdParam, 10);

        if (isNaN(userId)) {
            return Response.json({ error: "userId must be a number" }, { status: 400 });
        } else{
            return Response.json({ ok: true, data: { userId: userIdParam}}, { status: 200 });
        }

        
    } catch (e) {

        //Me falta implementar bien el manejo de errores OJO!!!
        return Response.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Database error" } }, { status: 500 });
    }
}

export async function POST() {
}