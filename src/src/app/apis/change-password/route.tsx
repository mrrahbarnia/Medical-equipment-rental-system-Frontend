"use server"
import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { deleteToken, getToken } from "@/utils/authUtils";

export interface changePasswordData {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

const EXTERNAL_CHANGE_PASSWORD_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/change-password/`;

export const PUT = async (request: NextRequest) => {
    const requestedData: changePasswordData = await request.json();

    const authToken = getToken();
    const response = await fetch(EXTERNAL_CHANGE_PASSWORD_API, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
            oldPassword: requestedData.oldPassword,
            newPassword: requestedData.newPassword,
            confirmPassword: requestedData.confirmPassword
        })
    })

    if (response.ok) {
        deleteToken();
        return NextResponse.json({"changed": true}, {status: 200})
    } else {
        const responseJson = await response.json()
        return NextResponse.json(responseJson, {status: response.status})
    }
}
