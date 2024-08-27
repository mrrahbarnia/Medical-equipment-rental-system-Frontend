"use server"

import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_LOGIN_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/login/`;

export async function POST(request: NextRequest) {
    const data = await request.formData();

    const response = await fetch(EXTERNAL_LOGIN_API, {
        method: "POST",
        body: data
    })
    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if (response.ok) {
        return NextResponse.json({"login": true}, {status: 200})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
