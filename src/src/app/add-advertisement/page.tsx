"use client"
import AddAdvertisementPage from "@/components/advertisement/AddAdvertisementPage";
import { Suspense } from "react";


const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <AddAdvertisementPage />
        </Suspense>
    )
};

export default Page;