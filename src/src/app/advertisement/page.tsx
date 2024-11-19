"use client"
import AdContainer from "@/components/advertisement/AdContainer";
import { Suspense } from "react";

const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <AdContainer />
        </Suspense>
    )
};

export default Page;