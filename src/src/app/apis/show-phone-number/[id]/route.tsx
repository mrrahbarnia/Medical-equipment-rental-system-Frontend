"use server"
import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { deleteToken, getToken } from "@/utils/authUtils";

const EXTERNAL_SHOW_PHONE_NUMBER_API: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/show-phone-number`;

export const GET = async (request: NextRequest) => {
    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_SHOW_PHONE_NUMBER_API}${request.url.slice(44)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    })
    if (response.ok) {
        return NextResponse.json(await response.json(), {status: 200})
    } else {
        return NextResponse.json(await response.json(), {status: response.status})
    }
}
