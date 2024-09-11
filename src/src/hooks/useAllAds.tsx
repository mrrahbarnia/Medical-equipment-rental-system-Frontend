"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_ALL_ADS_API: string = "/apis/admin/"

export interface searchParams {
    phoneNumber?: string | null,
    published?: boolean | null,
    isDeleted?: boolean | null
}

export interface adminAdType {
    id: string,
    phoneNumber: string,
    published: boolean,
    isBanned: boolean,
    isDeleted: boolean
}

const useAllAds = (searchParams?: searchParams) => {
    let itemsCount = 0;
    const {data, isPending, isError} = useQuery({
        queryKey: ["All-Ads", searchParams],
        staleTime: 10000,
        // @ts-ignore
        queryFn: async function (queryKey: (string | searchParams | undefined)[]) {
            const result = await axios.get<{count:number, items: adminAdType[]}>(
                INTERNAL_ALL_ADS_API, {params: searchParams}
            )
            return result.data
        },
        select: (result: {count: number, items: adminAdType[]}) => {
            itemsCount = result.count;
            return result.items
        }
    })

    return {data, isPending, isError, itemsCount}
}

export default useAllAds;
