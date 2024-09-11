"use client";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_DELETE_CATEGORY_API: string = "/apis/categories/delete/";

const useDeleteCategory = () => {
    const client = useQueryClient()
    const {mutateAsync} = useMutation({
        mutationFn: (id: number) => {            
            return axios.delete(`${INTERNAL_DELETE_CATEGORY_API}/${id}/`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["All-Categories"]});
        }
    })
    return {
        categoryMutateAsync: mutateAsync
    };
};

export default useDeleteCategory;