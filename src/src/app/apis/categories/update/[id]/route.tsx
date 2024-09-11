"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_UPDATE_CATEGORY_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/update-category/`

export const PUT = async (request: NextRequest) => {
    const data = await request.json();
    const id = request.url.slice(45);
    

    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_UPDATE_CATEGORY_API}${id}`, {
        method: "PUT",
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
