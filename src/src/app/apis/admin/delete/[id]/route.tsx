"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_DELETE_AD_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/delete-advertisement/`

export const DELETE = async (request: NextRequest) => {
    const params = request.url.slice(40);

    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_DELETE_AD_API}${params}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    })
    
    if (response.ok) {
        return NextResponse.json({status: 200})
    } else {
        return NextResponse.json({"deleted": false}, {status: response.status})
    }
}
