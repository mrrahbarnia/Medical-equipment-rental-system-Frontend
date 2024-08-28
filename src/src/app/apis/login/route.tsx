"use server"

import { NextRequest, NextResponse } from "next/server";
import { setToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_LOGIN_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/login/`;

export async function POST(request: NextRequest) {
    const data = await request.formData();

    const response = await fetch(EXTERNAL_LOGIN_API, {
        method: "POST",
        body: data
    })
    const jsonResponse = await response.json();

    if (response.ok) {
        console.log(jsonResponse?.access_token);
        setToken(jsonResponse?.access_token)
        return NextResponse.json({"login": true}, {status: 200})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
