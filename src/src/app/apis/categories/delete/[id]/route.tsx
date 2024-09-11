"use server"
import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { getToken } from "@/utils/authUtils";

const EXTERNAL_DELETE_CATEGORY_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/delete-category/`;

export const DELETE = async (request: NextRequest) => {
    const id: string = request.url.slice(45)
    
    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_DELETE_CATEGORY_API}${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    })
    
    if (response.ok) {
        return NextResponse.json({status: 204})
    } else {
        return NextResponse.json({"deleted": false}, {status: response.status})
    }
}
