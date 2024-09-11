"use client"
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_PUBLISH_AD_API: string = "/apis/admin/publish/"

const usePublishAd = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: (id: string) => {
            return axios.get(`${INTERNAL_PUBLISH_AD_API}${id}`)
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["All-Ads"]})
            client.invalidateQueries({queryKey: ["AdAdminDetail"]})
        }
    })
    return {
        publishedMutate: mutate
    }
}

export default usePublishAd;
