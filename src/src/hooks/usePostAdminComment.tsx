"use client";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_ADMIN_COMMENT_API: string = "/apis/admin/comment/";

const usePostAdminComment = () => {
    const client = useQueryClient();
    const {mutateAsync} = useMutation({
        mutationFn: async({adminComment, id}: {adminComment: string | undefined, id: string}) => {
            await axios.patch(`${INTERNAL_ADMIN_COMMENT_API}${id}`, {"adminComment": adminComment})
        },
        onSuccess: () => {
            client.invalidateQueries({queryKey: ["AdAdminDetail"]})
        }
    })

    return {
        adminCommentAsyncMutate: mutateAsync
    }
}

export default usePostAdminComment;