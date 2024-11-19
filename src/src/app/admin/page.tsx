"use client"
import AdminPage from "@/components/admin/AdminPage";
import { Suspense } from "react";


const Page = () => {
    return (
        <Suspense fallback={<div className="w-full mx-auto pt-20">در حال بارگذاری</div>}>
            <AdminPage />
        </Suspense>
    )
};

export default Page;