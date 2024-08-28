"use server"

import { NextResponse } from "next/server"
import { deleteToken } from "@/utils/authUtils";

export async function GET() {    
    deleteToken();
    return NextResponse.json({"login": true}, {status: 200});
}
