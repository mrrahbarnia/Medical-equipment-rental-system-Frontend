"use server"

import { NextRequest, NextResponse } from "next/server"
import { resetPasswordData } from "@/types/apis/resetPassword";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_VERIFY_ACCOUNT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/reset-password/`;

export async function POST(request: NextRequest) {
    const data: resetPasswordData = await request.json();

    const response = await fetch(EXTERNAL_VERIFY_ACCOUNT_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phoneNumber: data.phoneNumber,
        })
    })
    const jsonResponse = await response.json();

    if (response.ok) {
        return NextResponse.json({"sent": true}, {status: 200})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
