"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";


const EXTERNAL_MOST_VIEWED_ADS: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/list/most-viewed-ads/`;

interface response {
    id: string,
    title: string,
    createdAt: Date,
    imageUrl: string
    categoryName: string,
    views: number
}

const useMostViewedAds = () => {
    const {data, isPending} = useQuery({
        queryKey: ["Most-Viewed-Ads"],
        staleTime: 3000,
        queryFn: async() => {
            const response = await axios.get<response[]>(EXTERNAL_MOST_VIEWED_ADS);
            return response.data
        }
    })

    return {
        mostViewedData: data,
        mostViewedIsPending: isPending
    };
}

export default useMostViewedAds;