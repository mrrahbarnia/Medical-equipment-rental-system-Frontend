"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_MY_AD_DETAIL_API: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/get-my-advertisement/`

export const GET = async (request: NextRequest) => {
    const id = request.url.slice(44);

    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_MY_AD_DETAIL_API}${id}`, {
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
