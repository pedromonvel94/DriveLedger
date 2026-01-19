import { timeStamp } from "console";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({
        status : "ok",
        timestamp: new Date().toDateString()
    })
}