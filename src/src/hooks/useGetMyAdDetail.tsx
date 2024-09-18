"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_MY_AD_DETAIL_API: string = "/apis/my-advertisement/"

interface responseData {
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

interface error {
    response?: {
        data?: {
            detail?: string
        }
    }
}

const useGetMyAdDetail = (id: string) => {
    const {data, isPending, error} = useQuery<responseData, error>({
        queryKey: ["My-Ad", id],
        refetchOnWindowFocus: false,
        queryFn: async() => {
            const result = await axios.get<responseData>(`${INTERNAL_MY_AD_DETAIL_API}${id}`)
            return result.data
        }
    })

    return {data, isPending, error}
}

export default useGetMyAdDetail;