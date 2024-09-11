"use server"
// @ts-ignore
import jwt from 'jsonwebtoken';
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { setToken } from "@/utils/authUtils";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_LOGIN_API: string = `${EXTERNAL_BASE_ENDPOINTS}/auth/login/`;

export const POST = async (request: NextRequest) => axios.post(
        EXTERNAL_LOGIN_API, await request.formData()
    ).then((response) => {
        const jsonWebToken = jwt.decode(response.data?.access_token);
        setToken(response.data?.access_token)
        return NextResponse.json(jsonWebToken, {status: 200})
    }).catch(() => {
        console.log("Failed in server");
        return NextResponse.json({"login": false}, {status: 400})
    })
