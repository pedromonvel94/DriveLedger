import { prisma } from "@/lib/prisma";

export async function GET() {
  const platforms = await prisma.platforms.findMany();
  const categories = await prisma.expense_categories.findMany();

  return Response.json({ platforms, categories });
}
