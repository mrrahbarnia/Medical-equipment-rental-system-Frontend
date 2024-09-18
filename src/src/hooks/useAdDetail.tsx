"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import L from "leaflet";

export interface responseData {
    id: string
    title: string,
    description: string,
    video?: string | null,
    place: string,
    latLon?: L.LatLngExpression | null,
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
        staleTime: 10000,
        refetchOnWindowFocus: false,
        queryFn: async function () {
            const url = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/get-advertisement/${id}`;
            const result = await axios.get<responseData>(url);
            return result.data
        }
    })
    return {isError, data, isPending}
}