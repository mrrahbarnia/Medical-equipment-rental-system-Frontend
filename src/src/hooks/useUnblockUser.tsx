"use client";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const INTERNAL_UNBLOCK_USER_API: string = "/apis/admin/unblock-user/";

const useUnblockUser = () => {
    const client = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: async(phoneNumber: string) => {
            const response = await axios.get(`${INTERNAL_UNBLOCK_USER_API}${phoneNumber}`)
            return response.data
        },
        onSuccess: () => {
            client.refetchQueries({queryKey: ["All-Ads"]})
        }
    })

    return {
        unblockUserMutate: mutate
    }
}

export default useUnblockUser;