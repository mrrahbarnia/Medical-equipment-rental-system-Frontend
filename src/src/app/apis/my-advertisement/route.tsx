"use server"
import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { getToken } from "@/utils/authUtils";

const EXTERNAL_MY_ADVERTISEMENT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/list/my-advertisement/`;

export const GET = async (request: NextRequest) => {
    const authToken = getToken();
    const response = await fetch(`${EXTERNAL_MY_ADVERTISEMENT_API}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    })
    const responseJson = await response.json()
    
    if (response.ok) {
        return NextResponse.json(responseJson, {status: 200})
    } else {
        return NextResponse.json(responseJson, {status: response.status})
    }
}
