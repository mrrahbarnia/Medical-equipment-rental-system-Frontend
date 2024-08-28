"use server"

import { NextRequest, NextResponse } from "next/server"
import { resetPasswordVerifyData } from "@/types/apis/resetPasswordVerify";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_RESET_PASSWORD_VERIFY_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/reset-password/verify/`;

export async function POST(request: NextRequest) {
    const data: resetPasswordVerifyData = await request.json();

    const response = await fetch(EXTERNAL_RESET_PASSWORD_VERIFY_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            randomPassword: data.randomPassword,
        })
    })
    const jsonResponse = await response.json();

    if (response.ok) {
        return NextResponse.json({"password-reset": true}, {status: 200})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
