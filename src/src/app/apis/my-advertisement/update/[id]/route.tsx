"use server"
import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { getToken } from "@/utils/authUtils";
import axios from "axios";

const EXTERNAL_UPDATE_MY_ADVERTISEMENT_API: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/update-my-advertisement/`;

export const PUT = async (request: NextRequest) => {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop(); 
        const formData = await request.formData();

        const images = Array.from(formData.entries()).filter(([key]) => key === "images").map(([, value]) => value);
        const newFormData = new FormData();

        if (images.length > 0) {
            images.forEach((image) => {
                // @ts-ignore
                if (image.size !== 0) {
                    newFormData.append("images", image);
                }
            });
        }
        // @ts-ignore
        const latLon = formData.get("latLon") ? (formData.get("latLon"))?.slice(1,-1).split(",") : undefined;

        const days = formData.get("days");
        const payload = {
            "title": formData.get("title"),
            "categoryName": formData.get("categoryName"),
            "place": formData.get("place"),
            "latLon": latLon,
            // @ts-ignore
            "previousImages": ((formData.get("previousImages"))?.slice(1, -1))?.split(","),
            // @ts-ignore
            "days": days ? days.split(",") : [],
            "hourPrice": Number(formData.get("hourPrice")),
            "dayPrice": Number(formData.get("dayPrice")),
            "weekPrice": Number(formData.get("weekPrice")),
            "monthPrice": Number(formData.get("monthPrice")),
            "description": formData.get("description")
        }
        const previousVideo = formData.get("previousVideo");
        if (previousVideo) {
            // @ts-ignore
            payload.previousVideo = previousVideo;
        }

        newFormData.append("payload", JSON.stringify(payload))
        // @ts-ignore
        if (formData.get("video") && formData.get("video").size !== 0) {
            // @ts-ignore
            newFormData.append("video", formData.get("video"));
        }

        const authToken = getToken();

        await axios.put(`${EXTERNAL_UPDATE_MY_ADVERTISEMENT_API}${id}`, newFormData, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        });

        return NextResponse.json({ status: 204 });
    } catch (e: any) {
        const errorResponse = e.response?.data || { message: "An unknown error occurred" };
        return NextResponse.json(errorResponse, { status: e.response?.status || 500 });
    }
};
