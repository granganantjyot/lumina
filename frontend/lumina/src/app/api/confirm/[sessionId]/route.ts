import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {

    try {

        const { sessionId } = await params

        // Get body of request
        const body = await req.json();

        // Make request 
        const response = await fetch(`${process.env.BACKEND_URL}/api/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, sessionId }),
        });


        // Return zip file in response
        const fileBuffer = await response.arrayBuffer();

        return new Response(fileBuffer, {
            status: 200,
        });


    } catch (error) {
        console.error("Error in confirm Route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}