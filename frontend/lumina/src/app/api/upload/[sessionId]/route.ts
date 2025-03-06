import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {

    try {
        const { sessionId } = await params 

        // Get formdata from request (contains images)
        const formData = await req.formData();
        formData.append("session_id", sessionId)

        // Make request to fastapi
        const response = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
            method: "POST",
            body: formData, // Send formData
        });

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Error in upload Route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}