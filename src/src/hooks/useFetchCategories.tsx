"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const INTERNAL_ALL_CATEGORIES_API: string = "/apis/categories/";

export interface categoryType {
    id: number,
    name: string,
    parentName: string
}

const useFetchCategories = () => {
    let itemsCount = 0;
    const {data, isPending, isError} = useQuery({
        queryKey: ["All-Categories"],
        staleTime: 10000,
        queryFn: async function () {
            const result = await axios.get<{count: number, items: categoryType[]}>(
                INTERNAL_ALL_CATEGORIES_API
            )
            return result.data
        },
        select: (result) => {
            itemsCount = result.count;
            return result.items;
        }
    })
    return {
        categoriesData: data,
        categoriesPending: isPending,
        categoriesError: isError,
        categoriesCount: itemsCount
    }
};

export default useFetchCategories;
