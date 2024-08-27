"use server"

import { NextRequest, NextResponse } from "next/server"
import { verifyAccountData } from "@/types/apis/verifyAccount";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_VERIFY_ACCOUNT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/verify-account/`;

export async function POST(request: NextRequest) {
    const data: verifyAccountData = await request.json();    

    const response = await fetch(EXTERNAL_VERIFY_ACCOUNT_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            verificationCode: data.verificationCode,
        })
    })
    const jsonResponse = await response.json();

    if (response.ok) {
        return NextResponse.json({"verified": true}, {status: 200})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
