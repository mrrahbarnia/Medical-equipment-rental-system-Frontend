"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_CANCEL_BLOCK_USER_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/cancel-ban-user/`

export const GET = async (request: NextRequest) => {
    const phoneNumber = request.url.slice(46);    

    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_CANCEL_BLOCK_USER_API}${phoneNumber}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    })
    if (response.ok) {
        return NextResponse.json({status: 200})
    } else {
        return NextResponse.json({"banned": false}, {status: response.status})
    }
}