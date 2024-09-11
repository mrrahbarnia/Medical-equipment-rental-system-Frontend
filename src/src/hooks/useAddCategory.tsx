"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface categoryInput {
    name: string,
    parentCategoryName?: string | null
}

const INTERNAL_ADD_CATEGORY_API: string = "/apis/categories/add/";


const useAddCategory = () => {
    const client = useQueryClient();
    const {mutateAsync} = useMutation({
        mutationFn: (data: categoryInput) => {
            return axios.post(INTERNAL_ADD_CATEGORY_API, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["All-Categories"]});
        }
    })

    return {
        createCategoryAsyncMutate: mutateAsync,
    }
}

export default useAddCategory;
