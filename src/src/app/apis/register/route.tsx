"use server"

import { NextRequest, NextResponse } from "next/server"
import { registerData } from "@/types/apis/register";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_REGISTER_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/register/`;

export async function POST(request: NextRequest) {
    const data: registerData = await request.json();

    const response = await fetch(EXTERNAL_REGISTER_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phoneNumber: data.phoneNumber,
            password: data.password,
            confirmPassword: data.confirmPassword
        })
    })
    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if (response.ok) {
        return NextResponse.json({"registered": true}, {status: 201})
    } else {
        return NextResponse.json({...jsonResponse}, {status: 400})
    }
}
