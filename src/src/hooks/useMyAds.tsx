import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_MY_ADVERTISEMENT_API: string = "/apis/my-advertisement/"

export interface MyAdsType {
    id: string,
    title: string,
    views: number,
    image: string,
    published: boolean
    adminComment?: string | null
}

interface error {
    response?: {
        data?: {
            detail?: string
        }
    }
}

export const useMyAds = () => {
    const {data, isPending, error} = useQuery<MyAdsType[], error>({
        queryKey: ["My-Ads"],
        staleTime: 10000,
        queryFn: async function () {
            const result = await axios.get<MyAdsType[]>(INTERNAL_MY_ADVERTISEMENT_API)
            return result.data
        }
    })

    return {data, isPending, error}
}