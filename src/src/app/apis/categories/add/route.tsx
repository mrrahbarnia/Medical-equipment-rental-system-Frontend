"use server";
import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { getToken } from "@/utils/authUtils";

const EXTERNAL_ADD_CATEGORY_API: string = `${EXTERNAL_BASE_ENDPOINTS}/admin/create-categories/`

export const POST = async (request: NextRequest) => {
    const data = await request.json()

    const token = getToken();
    const response = await fetch(
        EXTERNAL_ADD_CATEGORY_API,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    )

    if (response.ok) {
        return NextResponse.json({"created": true}, {status: 201})
    } else {
        return NextResponse.json(await response.json(), {status: 400})
    }
}