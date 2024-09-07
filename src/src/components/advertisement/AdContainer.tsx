"use client"
import { GrFormPrevious } from "react-icons/gr"; 
import { MdNavigateNext } from "react-icons/md"; 
import axios from "axios";
import { convertEnglishNumberToPersian } from "@/utils/convertNumberToPersian";
import { AiOutlineSearch } from "react-icons/ai";
import { usePublishedAds } from "@/hooks/usePublishedAds";
import { searchedAds } from "@/hooks/usePublishedAds";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import AdList from "./AdList";
import { errorHandler } from "@/utils/messageUtils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, Fragment, useState, useEffect } from "react";

const AdContainer = () => {
    const [searchMenuStatus, setSearchMenuStatus] = useState<boolean>(false);
    const [searchedParams, setSearchedParams] = useState<searchedAds>();
    const [formError, setFormError] = useState("");
    const {data, isPending, itemCount} = usePublishedAds(searchedParams);
    const [categoriesResponse, setCategoriesResponse] = useState<string[]>([]);
    const [categoryInputValue, setCategoryInputValue] = useState<string>(); 
    const [debouncedCategory, setDebouncedCategories] = useState<string>();
    const [openCategoriesMenu, setOpenCategoriesMenu] = useState<boolean>(false);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const searchParam = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setSearchedParams({
            "textIcontains": searchParam.get("textIcontains"),
            "placeIcontains": searchParam.get("placeIcontains"),
            "categoryName": searchParam.get("categoryName"),
            "hourPriceRange": searchParam.get("hourPriceRange"),
            "dayPriceRange": searchParam.get("dayPriceRange"),
            "weekPriceRange": searchParam.get("weekPriceRange"),
            "monthPriceRange": searchParam.get("monthPriceRange"),
            "page": searchParam.get("page")
        })
    }, [searchParam])

    useEffect(() => {
        setCategoriesLoading(true);
        const handler = setTimeout(() => {
            setDebouncedCategories(categoryInputValue);
            setCategoriesLoading(false);
        }, 500);
        return () => {
            clearTimeout(handler)
        }
    }, [categoryInputValue])

    useEffect(() => {
        if (debouncedCategory) {
            const url = `${EXTERNAL_BASE_ENDPOINTS}/admin/search-categories/`
            const fetchCategories = async() => {
                try {
                    const result = await axios.get(url, {params: {category_name: debouncedCategory}})
                    setCategoriesResponse(result.data);
                    
                } catch (error) {
                }
            };
            fetchCategories();
        }
    }, [debouncedCategory])

    
    const searchFormSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const eventForm = event.target as HTMLFormElement;

        if (eventForm.minHourlyPrice.value !== "" && eventForm.maxHourlyPrice.value === "" || eventForm.maxHourlyPrice.value !== "" && eventForm.minHourlyPrice.value === "") {
            errorHandler("محدوده قیمت ساعتی باید کامل شود.", setFormError);
            return;
        }
        
        if (eventForm.minDailyPrice.value !== "" && eventForm.maxDailyPrice.value === "" || eventForm.maxDailyPrice.value !== "" && eventForm.minDailyPrice.value === "") {
            errorHandler("محدوده قیمت روزانه باید کامل شود.", setFormError);
            return;
        }

        if (eventForm.minWeeklyPrice.value !== "" && eventForm.maxWeeklyPrice.value === "" || eventForm.minWeeklyPrice.value !== "" && eventForm.maxWeeklyPrice.value === "") {
            errorHandler("محدوده قیمت هفتگی باید کامل شود.", setFormError);
            return;
        }

        if (eventForm.minMonthlyPrice.value !== "" && eventForm.maxMonthlyPrice.value === "" || eventForm.minMonthlyPrice.value !== "" && eventForm.maxMonthlyPrice.value === "") {
            errorHandler("محدوده قیمت ماهانه باید کامل شود.", setFormError);
            return;
        }
        const hourlyRangeInput = `${eventForm.minHourlyPrice.value}, ${eventForm.maxHourlyPrice.value}`;
        const hourlyRangeParam = hourlyRangeInput === ", " ? "" : hourlyRangeInput;

        const dayRangeInput = `${eventForm.minDailyPrice.value}, ${eventForm.maxDailyPrice.value}`;
        const dayRangeParam = dayRangeInput === ", " ? "" : dayRangeInput;

        const weekRangeInput = `${eventForm.minWeeklyPrice.value}, ${eventForm.maxWeeklyPrice.value}`;
        const weekRangeParam = weekRangeInput === ", " ? "" : weekRangeInput;

        const monthRangeInput = `${eventForm.minMonthlyPrice.value}, ${eventForm.maxMonthlyPrice.value}`;
        const monthRangeParam = monthRangeInput === ", " ? "" : monthRangeInput;
        const url = `/advertisement/?page=1&textIcontains=${eventForm.textIcontains.value}&placeIcontains=${eventForm.placeIcontains.value}&categoryName=${eventForm.categoryName.value}&hourPriceRange=${hourlyRangeParam}&dayPriceRange=${dayRangeParam}&weekPriceRange=${weekRangeParam}&monthPriceRange=${monthRangeParam}`
        setSearchMenuStatus(false);
        return router.replace(url)
    }

    const categoryAutoCompleteHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length >= 2) {
            setOpenCategoriesMenu(true);
        } else {
            setOpenCategoriesMenu(false);
        }
        setCategoryInputValue(event.target.value);
    }

    const selectCategoryHandler = (category: string) => {
        setCategoryInputValue(category);
        setOpenCategoriesMenu(false);
    }

    let hasPreviousPage: boolean;
    let hasNextPage: boolean;

    if (searchParam.get("page")) {
        if (searchParam.get("page") === "1") {
            hasPreviousPage = false;
        } else {
            hasPreviousPage = true;
        }
    } else {
        hasPreviousPage = false;
    }

    if ((Number(searchParam.get("page")) ? Number(searchParam.get("page")) : 1 ) * 10 <= itemCount) {
        hasNextPage = true;
    } else {
        hasNextPage = false;
    }

    const previousHandler = () => {
        const url = `/advertisement/?page=${searchParam.get("page") ? Number(searchParam.get("page")) -1  : "1"}${searchParam.get("textIcontains") ? `&textIcontains=${searchParam.get("textIcontains")}` : ""}${searchParam.get("placeIcontains") ? `&placeIcontains=${searchParam.get("placeIcontains")}` : ""}${searchParam.get("categoryName") ? `&categoryName=${searchParam.get("categoryName")}` : ""}${searchParam.get("hourPriceRange") ? `&hourPriceRange=${searchParam.get("hourPriceRange")}` : ""}${searchParam.get("dayPriceRange") ? `&dayPriceRange=${searchParam.get("dayPriceRange")}` : ""}${searchParam.get("weekPriceRange") ? `&weekPriceRange=${searchParam.get("weekPriceRange")}` : ""}${searchParam.get("monthPriceRange") ? `&monthPriceRange=${searchParam.get("monthPriceRange")}` : ""}`
        return router.replace(url);
    }

    const nextHandler = () => {
        const url = `/advertisement/?page=${searchParam.get("page") ? Number(searchParam.get("page")) + 1  : "2"}${searchParam.get("textIcontains") ? `&textIcontains=${searchParam.get("textIcontains")}` : ""}${searchParam.get("placeIcontains") ? `&placeIcontains=${searchParam.get("placeIcontains")}` : ""}${searchParam.get("categoryName") ? `&categoryName=${searchParam.get("categoryName")}` : ""}${searchParam.get("hourPriceRange") ? `&hourPriceRange=${searchParam.get("hourPriceRange")}` : ""}${searchParam.get("dayPriceRange") ? `&dayPriceRange=${searchParam.get("dayPriceRange")}` : ""}${searchParam.get("weekPriceRange") ? `&weekPriceRange=${searchParam.get("weekPriceRange")}` : ""}${searchParam.get("monthPriceRange") ? `&monthPriceRange=${searchParam.get("monthPriceRange")}` : ""}`
        return router.replace(url);
    }

    return (
        <Fragment>
            <div className="pt-40 w-11/12 mx-auto min-h-screen">
                <div className="flex flex-col gap-8">

                    <h1 className="font-[Yekan-Bold] text-center">لیست آگهی ها</h1>

                    <div className="flex items-center justify-between">
                        <p className="font-[Yekan-Medium]" dir="rtl">
                            تعداد آگهی ها:{itemCount && convertEnglishNumberToPersian(itemCount)}
                        </p>
                        <div className="flex gap-2 cursor-pointer py-1 px-2 rounded-md hover:bg-gray-100">
                            <p className="font-[Yekan-Medium]" onClick={() => setSearchMenuStatus(true)}>فیلتر پیشرفته</p>
                            <AiOutlineSearch size={23}/>
                        </div>
                    </div>
                    {isPending ? <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : <AdList adsList={data}/>}
                </div>
            </div>
            <div className={`bg-gradient-to-r from-white to-gray-200 z-50 w-full h-full overflow-scroll lg:w-[35%] md:w-[50%] fixed right-0 top-0 ${searchMenuStatus ? "translate-x-0" : "translate-x-full"} transition transform duration-500`}>
                <button className=" right-4 top-4 absolute font-bold" onClick={() => setSearchMenuStatus(false)}>X</button>
                <form onSubmit={searchFormSubmitHandler} className="h-auto w-5/6 mx-auto my-20  rounded-md p-3 flex flex-col gap-5">
                    <div className="flex flex-col text-end gap-2">
                        <label className="font-[Yekan-Medium]">متن آگهی</label>
                        <input name="textIcontains" type="text" className="h-9 px-3 py-1 border-2 rounded-md font-[Yekan-Medium]" dir="rtl" />
                    </div>
                    <div className="flex flex-col text-end gap-2">
                        <label className="font-[Yekan-Medium]">آدرس</label>
                        <input name="placeIcontains" type="text" className="border-2 h-9 px-3 py-1 rounded-md font-[Yekan-Medium]" dir="rtl" />
                    </div>
                    <div className="flex flex-col text-end gap-2">
                        <label className="font-[Yekan-Medium]">دسته بندی</label>
                        <input onChange={categoryAutoCompleteHandler} name="categoryName" type="text" className="border-2 h-9 px-3 py-1 rounded-md font-[Yekan-Medium]" dir="rtl" value={categoryInputValue}/>
                        {openCategoriesMenu && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2">
                            {categoriesLoading ? <p className="rounded-full border-8 w-7 h-7 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : 
                            categoriesResponse.length === 0 ? <p className="font-[Yekan-Medium]">دسته بندی یافت نشد</p> : categoriesResponse.map((category) => <li onClick={() => selectCategoryHandler(category)} className="cursor-pointer hover:bg-gray-100 font-[Yekan-Medium] rounded-md px-2 py-1" key={category}>{category}</li>)}
                        </ul>}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">(تومان)قیمت ساعتی</label>
                        <div className="flex flex-col items-end gap-2">
                            <input name="minHourlyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="از مبلغ"/>
                            <input name="maxHourlyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="تا مبلغ" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">(تومان)قیمت روزانه</label>
                        <div className="flex flex-col items-end gap-2">
                            <input name="minDailyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="از مبلغ"/>
                            <input name="maxDailyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="تا مبلغ" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">(تومان)قیمت هفتگی</label>
                        <div className="flex flex-col items-end gap-2">
                            <input name="minWeeklyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="از مبلغ"/>
                            <input name="maxWeeklyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="تا مبلغ" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <label className="font-[Yekan-Medium]">(تومان)قیمت ماهانه</label>
                        <div className="flex flex-col items-end gap-2">
                            <input name="minMonthlyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="از مبلغ"/>
                            <input name="maxMonthlyPrice" type="number" className="border-2 font-[Yekan-Medium] py-1 px-2 rounded-lg" dir="rtl" placeholder="تا مبلغ" />
                        </div>
                    </div>
                    {formError && <p className="bg-red-600 text-white font-[Yekan-Medium] rounded-md text-ms text-right py-2 px-4" dir="rtl">{formError}</p>}
                    <button className="text-white font-[Yekan-Bold] bg-green-600 w-fit mx-auto px-6 py-2 rounded-md hover:bg-green-700 mt-4" type="submit">جستجو</button>
                </form>
            </div>
            {searchMenuStatus && <div className="fixed left-0 top-0 z-30 bg-black h-full w-full opacity-65"></div>}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-12 mt-8">
                {hasPreviousPage && <button onClick={previousHandler} className="shadow-md shadow-black bg-violet-400 rounded-lg py-1 px-3 flex items-center cursor-pointer hover:scale-125 transition duration-300">
                    <GrFormPrevious size={25} />
                    <p className="font-[Yekan-Medium]">صفحه قبل</p>
                </button>}
                {hasNextPage && <button onClick={nextHandler} className="shadow-md shadow-black bg-violet-400 rounded-lg py-1 px-3 flex items-center cursor-pointer hover:scale-125 transition duration-300">
                    <p className="font-[Yekan-Medium]">صفحه بعد</p>
                    <MdNavigateNext size={28} />
                </button>}
            </div>
        </Fragment>
    )
};

export default AdContainer;