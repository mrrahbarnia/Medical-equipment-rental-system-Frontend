"use server"
import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { getToken } from "@/utils/authUtils";

const EXTERNAL_ADD_ADVERTISEMENT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/add-advertisement/`;

export const POST = async (request: NextRequest) => {
    const formData = await request.formData();
    const authToken = getToken();
    const images = Array.from(formData.entries()).filter(([key, value]) => key === "images").map(([key, value]) => value)
    const newFormData = new FormData();
    images.forEach((image) => {
        newFormData.append("images", image)
    })

    newFormData.append("payload", JSON.stringify({
        "title": formData.get("title"),
        "categoryName": formData.get("categoryName"),
        "place": formData.get("place"),
        // @ts-ignore
        "days": formData.get("days")?.split(","),
        "hourPrice": Number(formData.get("hourPrice")),
        "dayPrice": Number(formData.get("dayPrice")),
        "weekPrice": Number(formData.get("weekPrice")),
        "monthPrice": Number(formData.get("monthPrice")),
        "description": formData.get("description")
    }))
    // @ts-ignore
    if (formData.get("video").size !== 0) {
        // @ts-ignore
        newFormData.append("video", formData.get("video"))
    }
    
    const response = await fetch(EXTERNAL_ADD_ADVERTISEMENT_API, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        body: newFormData
    })
    
    if (response.ok) {
        return NextResponse.json({"created": true, status: 201})
    }
    if (!response.ok) {
        const jsonResponse = await response.json();
        return NextResponse.json(jsonResponse, {status: response.status})
    }
}
