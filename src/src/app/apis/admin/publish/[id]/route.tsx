"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_PUBLISH_AD_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/publish-advertisement/`

export const GET = async (request: NextRequest) => {
    const params = request.url.slice(41);

    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_PUBLISH_AD_API}${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    })
    if (response.ok) {
        return NextResponse.json({status: 200})
    } else {
        return NextResponse.json({"notPublished": true}, {status: response.status})
    }
}