"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";

const INTERNAL_DETAIL_AD_API: string = "/apis/admin/"

export interface responseData {
    id: string
    title: string,
    description: string,
    video?: string | null,
    place: string,
    latLon?: L.LatLngExpression | null,
    adminComment?: string | null,
    hourPrice?: string | null,
    dayPrice?: string | null,
    weekPrice?: string | null,
    monthPrice?: string | null,
    imageUrls: string[],
    days: string[],
    categoryName: string,
    published: boolean,
    isDeleted: boolean
}

export const useAdminAdDetail = (id: string) => {
    const {data, isError, isPending} = useQuery({
        queryKey: ["AdAdminDetail", id],
        staleTime: 5000,
        queryFn: async function () {
            const url = `${INTERNAL_DETAIL_AD_API}/${id}`;
            const result = await axios.get<responseData>(url);
            return result.data
        }
    })
    return {isError, data, isPending}
}

export default useAdminAdDetail;