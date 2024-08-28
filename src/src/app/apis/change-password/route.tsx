"use server"

import { NextRequest, NextResponse } from "next/server"
import { changePasswordData } from "@/types/apis/changePassword";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import { deleteToken } from "@/utils/authUtils";
import loginRequiredProxy from "../proxy";

const EXTERNAL_CHANGE_PASSWORD_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/change-password/`;

export async function PUT(request: NextRequest) {
    const requestedData: changePasswordData = await request.json();
    const {data, status} = await loginRequiredProxy.putJson(
        EXTERNAL_CHANGE_PASSWORD_API,
        JSON.stringify(
            {
                oldPassword: requestedData.oldPassword,
                newPassword: requestedData.newPassword,
                confirmPassword: requestedData.confirmPassword
            }
        )
    )
    if (status==200) {
        deleteToken();
    }
    return NextResponse.json(data, {status: status})
}
