"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

const EXTERNAL_RECENT_ADS: string = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/list/recent-ads/`;

interface response {
    id: string,
    title: string,
    createdAt: Date,
    imageUrl: string,
    categoryName: string,
}

const useRecentAds = () => {
    const {data, isPending} = useQuery({
        queryKey: ["Recent-Ads"],
        queryFn: async() => {
            const response = await axios.get<response[]>(EXTERNAL_RECENT_ADS);
            return response.data
        }
    })

    return {
        recentAdsData: data,
        recentAdsIsPending: isPending
    };
}

export default useRecentAds;