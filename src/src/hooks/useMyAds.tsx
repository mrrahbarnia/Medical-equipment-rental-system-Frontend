// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// const INTERNAL_MY_ADVERTISEMENT_API: string = "/apis/my-advertisement/"

// export interface MyAdsType {
//     id: string,
//     title: string,
//     views: number,
//     image: string,
//     published: boolean
// }

// export const useMyAds = () => {
//     const {data, isPending, isError} = useQuery({
//         queryKey: ["My-Ads"],
//         // staleTime
//         queryFn: async function () {
//             const result = await axios.get()
//         }
//     })
// }