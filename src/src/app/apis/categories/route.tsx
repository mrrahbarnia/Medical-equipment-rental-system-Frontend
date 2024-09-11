"use server"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_ALL_CATEGORIES_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/all-categories/`

export const GET = async (request: NextRequest) => {
    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_ALL_CATEGORIES_API}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    })

    if (response.ok) {
        return NextResponse.json(await response.json(), {status: 200})
    } else {
        return NextResponse.json({"fetched": false}, {status: response.status})
    }
}