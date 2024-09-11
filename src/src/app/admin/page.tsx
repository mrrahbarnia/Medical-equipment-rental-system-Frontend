"use client"
import { AiOutlineSearch } from "react-icons/ai"; 
import useAllAds from "@/hooks/useAllAds";
import AdminListAds from "@/components/admin/AdminListAds";
import { searchParams } from "@/hooks/useAllAds";
import { Fragment, useState, FormEvent, useEffect } from "react";
import { convertEnglishNumberToPersian } from "@/utils/convertNumberToPersian";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/authProvider";

const Page = () => {
    const [searchParams, setSearchParams] = useState<searchParams>({
        phoneNumber: null,
        published: null,
        isDeleted: null
    });
    const [searchMenuStatus, setSearchMenuStatus] = useState<boolean>(false);
    const {data, isPending, isError, itemsCount} = useAllAds(searchParams);
    const router = useRouter();
    const searchParam = useSearchParams();
    const auth = useAuth()

    // useEffect(() => {
    //     auth.adminPages();
    // }, [auth])

    const searchFormSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;
        const url = `/admin/?phoneNumber=${eventForm.phoneNumber.value}&published=${eventForm.published.value !== "--" ? eventForm.published.value : ""}&isDeleted=${eventForm.isDeleted.value !== "--" ? eventForm.isDeleted.value: ""}`;
        setSearchMenuStatus(false);
        return router.replace(url);
    }

    useEffect(() => {
        const published: boolean | null = searchParam.get("published") === "1" ? true : searchParam.get("published") === "0" ? false : null;
        const isDeleted: boolean | null = searchParam.get("isDeleted") === "1" ? true : searchParam.get("isDeleted") === "0" ? false : null;
        setSearchParams({
            "phoneNumber": searchParam.get("phoneNumber"),
            "published": published,
            "isDeleted": isDeleted
        })
    }, [searchParam])

    if (isError) {
        auth.logout();
        return (
            <div className="h-screen flex items-center justify-center">
                <p dir="rtl" className="bg-red-600 py-2 text-white px-3 rounded-lg font-[Yekan-Bold]">برای دسترسی به این صفحه ابتدا باید وارد حساب کاربری خود شوید.</p>
            </div>
        )
    }

    return (
        <Fragment>
            <div className="pt-40 w-11/12 mx-auto min-h-screen">
                <div className="flex flex-col gap-8">
                    <h1 className="font-[Yekan-Bold] text-center">لیست آگهی ها</h1>
                    <div className="flex items-center justify-between">
                        <p className="font-[Yekan-Medium]" dir="rtl">
                            تعداد آگهی ها:{itemsCount && convertEnglishNumberToPersian(itemsCount)}
                        </p>
                        <div className="flex gap-2 cursor-pointer py-1 px-2 rounded-md hover:bg-gray-100">
                            <p className="font-[Yekan-Medium]" onClick={() => setSearchMenuStatus(true)}>فیلتر پیشرفته</p>
                            <AiOutlineSearch size={23}/>
                        </div>
                    </div>
                    {isPending ? <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : data ? <AdminListAds ads={data}/> : undefined}
                </div>
            </div>
            <div className={`bg-gradient-to-r from-white to-gray-200 z-50 w-full h-full overflow-scroll lg:w-[35%] md:w-[50%] fixed right-0 top-0 ${searchMenuStatus ? "translate-x-0" : "translate-x-full"} transition transform duration-500`}>
            <button className=" right-4 top-4 absolute font-bold" onClick={() => setSearchMenuStatus(false)}>X</button>
                <form onSubmit={searchFormSubmitHandler} className="h-auto w-5/6 mx-auto my-20  rounded-md p-3 flex flex-col gap-5">
                    <div className="flex flex-col items-end text-end gap-2">
                        <label className="font-[Yekan-Medium]">شماره موبایل</label>
                        <input name="phoneNumber" type="text" className="h-9 px-3 py-1 border-2 rounded-md font-[Yekan-Medium] w-[260px]"/>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">وضعیت انتشار</label>
                        <select name="published" className="h-9 px-3 py-1 rounded-md font-[Yekan-Medium] w-[260px]" dir="rtl">
                            <option defaultValue="--">--</option>
                            <option value="1">منتشر شده ها</option>
                            <option value="0">منتشر نشده ها</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">وضعیت آگهی ها</label>
                        <select name="isDeleted" className="h-9 px-3 py-1 rounded-md font-[Yekan-Medium] w-[260px]" dir="rtl">
                            <option defaultValue="--">--</option>
                            <option value="1">پاک شده ها</option>
                            <option value="0">پاک نشده ها</option>
                        </select>
                    </div>
                    <button className="text-white font-[Yekan-Bold] bg-green-600 w-fit mx-auto px-6 py-2 rounded-md hover:bg-green-700 mt-24" type="submit">جستجو</button>
                </form>
            </div>
            {searchMenuStatus && <div className="fixed left-0 top-0 z-30 bg-black h-full w-full opacity-65"></div>}
        </Fragment>
    )
};

export default Page;