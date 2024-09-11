"use client";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const INTERNAL_BLOCK_USER_API: string = "/apis/admin/block-user/";

const useBlockUser = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: async(phoneNumber: string) => {
            const response = await axios.get(`${INTERNAL_BLOCK_USER_API}${phoneNumber}`)
            return response.data
        },
        onSuccess: () => {
            client.refetchQueries({queryKey: ["All-Ads"]})
        }
    })

    return {
        blockUserMutate: mutate
    }
}

export default useBlockUser;