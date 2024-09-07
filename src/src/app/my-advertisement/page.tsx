"use client"
import { useAuth } from "@/contexts/authProvider";
import { useMyAds } from "@/hooks/useMyAds";
import MyAdsList from "@/components/my-ads/MyAdsList";

const Page = () => {
    const auth = useAuth()
    const {data, isPending, isError} = useMyAds()

    if (isError) {
        auth.logout();
        return <div className="h-screen flex items-center justify-center">
                <p dir="rtl" className="bg-red-600 py-2 text-white px-3 rounded-lg font-[Yekan-Bold]">برای دسترسی به این صفحه ابتدا باید وارد حساب کاربری خود شوید.</p>
            </div>
    }
    return (
        <div className="pt-72 w-11/12 mx-auto min-h-screen">
            {isPending ? <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : data ? <MyAdsList adsList={data}/> : undefined}
        </div>
    )
    
};

export default Page;