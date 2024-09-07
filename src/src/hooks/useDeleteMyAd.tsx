import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const INTERNAL_DELETE_MY_AD_API: string = "/apis/my-advertisement/delete";

const useDeleteMyAd = () => {
    const client = useQueryClient()
    const {mutateAsync} = useMutation({
        mutationFn: (id: string) => {            
            return axios.delete(`${INTERNAL_DELETE_MY_AD_API}/${id}/`)
        },
        onSuccess:() => {
            client.invalidateQueries({queryKey: ["My-Ads"]})
        }
    })
    return {mutateAsync};
};

export default useDeleteMyAd;