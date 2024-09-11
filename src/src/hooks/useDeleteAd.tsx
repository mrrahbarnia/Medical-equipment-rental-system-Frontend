"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_DELETE_AD_API: string = "/apis/admin/delete/"

const useDeleteAd = () => {
    const client = useQueryClient();
    const {mutateAsync, isPending} = useMutation({
        mutationFn: (id: string) => {
            return axios.delete(`${INTERNAL_DELETE_AD_API}${id}`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["All-Ads"]})
        }
    })
    return {
        deleteMutate: mutateAsync,
        deletePending: isPending,
    }
}

export default useDeleteAd;
