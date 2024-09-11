"use client";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_UPDATE_CATEGORY_API: string = "/apis/categories/update/";

const useUpdateCategory = () => {
    const client = useQueryClient();
    const {mutateAsync} = useMutation({
        mutationFn: ({id, name, parentCategoryName}: {id: number, name: string, parentCategoryName: string}) => {
            const data = {
                name,
                parentCategoryName
            }
            return axios.put(`${INTERNAL_UPDATE_CATEGORY_API}${id}`, data , {
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
        mutateAsyncUpdateCategory: mutateAsync
    }
}

export default useUpdateCategory;
