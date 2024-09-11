"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_UNPUBLISH_AD_API: string = "/apis/admin/unpublish/"

const useUnpublishAd = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: (id: string) => {
            return axios.get(`${INTERNAL_UNPUBLISH_AD_API}${id}`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["All-Ads"]})
            client.invalidateQueries({queryKey: ["AdAdminDetail"]})
        }
    })
    return {
        UnpublishedMutate: mutate
    }
}

export default useUnpublishAd;
