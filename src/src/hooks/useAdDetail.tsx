"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

export interface responseData {
    id: string
    title: string,
    description: string,
    video?: string | null,
    place: string,
    hourPrice?: string | null,
    dayPrice?: string | null,
    weekPrice?: string | null,
    monthPrice?: string | null,
    imageUrls: string[],
    days: string[],
    categoryName: string
}

export const usePublicDetailAd = (id: string) => {
    const {data, isError, isPending} = useQuery({
        queryKey: ["AdDetail", id],
        staleTime: 5000,
        queryFn: async function () {
            const url = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/get-advertisement/${id}`;
            const result = await axios.get<responseData>(url);
            return result.data
        }
    })
    return {isError, data, isPending}
}