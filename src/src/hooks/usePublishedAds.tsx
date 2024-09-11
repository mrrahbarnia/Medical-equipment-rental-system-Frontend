import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";

export interface searchedAds {
    textIcontains?: string | null,
    placeIcontains?: string | null,
    hourPriceRange?: string | null,
    dayPriceRange?: string | null,
    weekPriceRange?: string | null,
    monthPriceRange?: string | null,
    categoryName?: string | null,
    page?: string | null
}

export interface Advertisement {
    id: string,
    title: string,
    description: string,
    place: string,
    image: string,
    categoryName: string
}

export const usePublishedAds = (searchParams?: searchedAds) => {
    let itemCount = 0;
    const {data, isPending} = useQuery({
        queryKey: ["Ads", searchParams],
        staleTime: 5000,
        // @ts-ignore
        queryFn: async function (queryKey: (string | searchedAds | undefined)[]) {
            const url = `${EXTERNAL_BASE_ENDPOINTS}/advertisement/published-advertisement/`
            const searchedParams = queryKey[1] as searchedAds;            
            const result = await axios.get<{count: number, items: Advertisement[]}>(url, {params: searchParams})
            return result.data
        },
        select: ((result: {count: number, items: Advertisement[]}) => {
            itemCount = result.count;
            return result.items;
        })
    })
    return {data, isPending, itemCount}
}

