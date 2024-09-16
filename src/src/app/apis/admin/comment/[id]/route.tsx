"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_ADMIN_COMMENT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/admin-comment/`

export const PATCH = async (request: NextRequest) => {
    const data = await request.json();
    const id = request.url.slice(41);
    
    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_ADMIN_COMMENT_API}${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        return NextResponse.json({status: 204})
    } else {
        return NextResponse.json(await response.json(), {status: response.status})
    }
}
