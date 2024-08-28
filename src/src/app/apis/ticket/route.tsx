"use server"

import { NextRequest, NextResponse } from "next/server"
import { createTicketData } from "@/types/apis/createTicket";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_VERIFY_ACCOUNT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/tickets/create-ticket/`;

export async function POST(request: NextRequest) {
    const data: createTicketData = await request.json();

    const response = await fetch(EXTERNAL_VERIFY_ACCOUNT_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message
        })
    })
    const jsonResponse = await response.json();

    if (response.ok) {
        return NextResponse.json({"created": true}, {status: 201})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
