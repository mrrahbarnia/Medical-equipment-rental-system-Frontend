"use client"
import { MdOutlineDangerous } from "react-icons/md";
import axios from "axios";
import { errorHandler } from "@/utils/messageUtils";
import { AiFillWarning } from "react-icons/ai";
import { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import DatePicker from "react-multi-date-picker";
import { useAuth } from "@/contexts/authProvider";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useRouter } from "next/navigation";

const INTERNAL_ADD_ADVERTISEMENT_API: string = "/apis/add-advertisement/"

const Page = () => {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categoryValue, setCategoryValue] = useState<string>("")
    const [openCategoriesMenu, setOpenCategoriesMenu] = useState<boolean>()
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const [categoriesResponse, setCategoriesResponse] = useState<string[]>([]);
    const [debouncedCategory, setDebouncedCategories] = useState<string>();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<File>();
    const [selectedPersianDays, setSelectedPersianDays] = useState<string[]>();
    const [selectedFormattedDays, setSelectedFormattedDays] = useState<string[]>([]);
    const [formError, setFormError] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if (selectedPersianDays && selectedPersianDays.length > 0) {
            const formattedDays = selectedPersianDays.map(persianDay => {
                // @ts-ignore
                const { day, month, year } = persianDay;
                return (`${year}-${String(month.number).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
            });
            setSelectedFormattedDays(formattedDays);
        }
    }, [selectedPersianDays])

    const formSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        // @ts-ignore
        const formData = new FormData(event.target);
        // @ts-ignore
        formData.append("days", selectedFormattedDays)
        axios.post(INTERNAL_ADD_ADVERTISEMENT_API, formData)
        .then(
            () => {
                setIsLoading(false);
                return router.replace("/my-advertisement/")
            }
        )
        .catch((error) => {
            console.log(error);
            if (error.status === 401) {
                errorHandler("برای ثبت آگهی ابتدا باید وارد حساب کاربری خود شوید.", setFormError);
                setIsLoading(false);
                auth.logout();
                return;
            }
            if (error.response && error.response.data?.detail === "This account is banned.") {
                setIsLoading(false);
                errorHandler("حساب کاربری شما مسدود شده است.", setFormError)
                return;
            }
            if (error.response.data && error.response.data.detail === "There is no category with the provided name!") {
                errorHandler("دسته بندی باید جزو موارد پیشنهاد شده باشد.", setFormError);
                setIsLoading(false);
                return;
            }
            if(error.response.data && error.response.data.detail[0].msg === "Value error, Was not assign any price!") {
                errorHandler("حداقل یکی از ورودی های قیمت باید وارد شود.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail[0].msg === "Value error, Expected UploadFile, received: <class 'str'>") {
                errorHandler("حداقل یک عکس باید بارگذاری شود.", setFormError)
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail[0].msg === "Value error, Selected days must at least be 7 days for setting week price!") {
                errorHandler("برای وارد کردن قیمت هفتگی باید حداقل هفت روز را برای اجاره دادن,انتخاب کرده باشید.", setFormError)
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail[0].msg === "Value error, Selected days must at least be 30 days for setting month price!") {
                errorHandler("برای وارد کردن قیمت ماهانه باید حداقل سی روز را برای اجاره دادن,انتخاب کرده باشید.", setFormError)
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail.includes("Video format must be in")) {
                errorHandler("فرمت فیلم بارگذاری شده باید mp4 یا video باشد.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail === "Advertisement at least has 3 images!") {
                errorHandler("حداکثر مجاز به بارگذاری سه عکس میباشید.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail.includes("Image file size must be maximum")) {
                errorHandler("حداکثر حجم مجاز برای هر عکس ۴۰۰ کیلوبایت میباشد.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail.includes("Video file size must be maximum")) {
                errorHandler("حداکثر حجم مجاز برای فیلم ۱۰۰ مگابایت میباشد.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail.includes("Image format must be in")) {
                errorHandler("فرمت عکس های بارگذاری شده باید png یا jpg باشد.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail[0].msg === "Input should be a valid date or datetime, input is too short") {
                errorHandler("حداقل یک روز جهت اجاره دادن کالا مورد نظر باید انتخاب شود.", setFormError)
                setIsLoading(false);
                return;
            }
        })
    }

    useEffect(() => {
        setCategoriesLoading(true);
        const handler = setTimeout(() => {
            setDebouncedCategories(categoryValue);
            setCategoriesLoading(false);
        }, 500);
        return () => {
            clearTimeout(handler)
        }
    }, [categoryValue])

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

    const categoryAutoCompleteHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length >= 2) {
            setOpenCategoriesMenu(true);
        } else {
            setOpenCategoriesMenu(false);
        }
        setCategoryValue(event.target.value);
    }

    const selectCategoryHandler = (category: string) => {
        setCategoryValue(category);
        setOpenCategoriesMenu(false);
    }

    return (
        <div className="pt-44 w-full px-2 m-auto min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5">
            <form encType="multipart/form-data" className="bg-gradient-to-b from-white to-gray-200 w-full py-16 px-6 rounded-lg shadow-lg flex flex-col gap-6" onSubmit={formSubmitHandler}>
                <h1 className="font-[Yekan-Bold] text-lg mx-auto">فرم ثبت آگهی</h1>
                <p className="text-gray-500 font-[Yekan-Medium] text-xs leading-6" dir="rtl">لازم به ذکر است که برای ثبت آگهی ابتدا باید وارد حساب کاربری خود شوید.</p>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">عنوان آگهی</label>
                    <input dir="rtl" type="text" name="title" required className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">آدرس</label>
                    <input dir="rtl" type="text" name="place" required className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">دسته بندی</label>
                    <input dir="rtl" type="text" name="categoryName" required className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full" onChange={categoryAutoCompleteHandler} value={categoryValue}/>
                    {!openCategoriesMenu && <p className="text-gray-500 font-[Yekan-Medium] text-xs leading-4" dir="rtl">با شروع به نوشتن دسته بندی مورد نظر موارد مرتبط به شما پیشنهاد داده میشود.</p>}
                    {!openCategoriesMenu && <div className="flex items-center bg-yellow-400 rounded-md py-1 px-2 gap-1">
                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">شما مجاز به انتخاب دسته بندی خارج از موارد پیشنهادی نیستید.</p>
                        <AiFillWarning size={25} />
                    </div>}
                    {openCategoriesMenu && <ul className="bg-gray-300 w-full rounded-md flex flex-col gap-2 px-2 py-2">
                        {categoriesLoading ? <p className="rounded-full border-8 w-7 h-7 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p> : 
                        categoriesResponse.length === 0 ? <p className="font-[Yekan-Medium] text-right">دسته بندی یافت نشد</p> : categoriesResponse.map((category) => <li onClick={() => selectCategoryHandler(category)} className="text-right cursor-pointer hover:bg-gray-100 font-[Yekan-Medium] rounded-md px-2 py-1" key={category}>{category}</li>)}
                    </ul>}
                </div>
                <div className="flex flex-col gap-1 bg-gradient-to-r from-violet-300 to-violet-100 py-2 px-3 rounded-md">
                    <span className="font-[Yekan-Medium] text-right">قیمت ها</span>
                    <div className="flex flex-col items-center gap-1">
                        <input dir="rtl" type="number" placeholder="قیمت ساعتی(تومان)" name="hourPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                        <input dir="rtl" type="number" placeholder="قیمت روزانه(تومان)" name="dayPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                        <input dir="rtl" type="number" placeholder="قیمت هفتگی(تومان)" name="weekPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full" />
                        <input dir="rtl" type="number" placeholder="قیمت ماهانه(تومان)" name="monthPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label htmlFor="image" className="block text-sm py-2 px-4 rounded-md border-0 bg-violet-50 text-violet-700 hover:bg-violet-200 cursor-pointer font-[Yekan-Medium]">{selectedImages.length < 3 ? "بارگذاری عکس ها" : "سقف فایل های ارسالی"}</label>
                    {selectedImages.length !== 0 && selectedImages[0].length !== 0 && <p className="font-[Yekan-Medium] text-sm px-2 py-1 bg-violet-200 rounded-md">تعداد عکس های انتخاب شده : {selectedImages[0].length}</p>}
                    {selectedImages.length !== 0 && selectedImages[0].length > 3 && <div className="flex gap-1 py-1 px-2 bg-red-600 text-white items-center rounded-md">
                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">حداکثر تعداد عکس های انتخاب شده سه عدد است.</p>
                        <MdOutlineDangerous size={25} />
                    </div>}

                    {/* @ts-ignore */}
                    <input type="file" id="image" name="images" multiple hidden onChange={(e) => setSelectedImages([e.target.files])}/>
                    <div className="flex items-center bg-yellow-400 rounded-md py-1 px-2 gap-1">
                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">حداکثر مجاز به ارسال سه عکس با حداکثر ۴۰۰ کیلوبایت حجم و در فرمت های jpg یا png هستید.</p>
                        <AiFillWarning size={25} />
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label htmlFor="video" className="block text-sm py-2 px-4 rounded-md border-0 bg-violet-50 text-violet-700 hover:bg-violet-200 cursor-pointer font-[Yekan-Medium]">بارگذاری فیلم</label>
                    {/* @ts-ignore */}
                    <input type="file" id="video" name="video" hidden onChange={(e) => setSelectedVideo(e.target.files[0])}/>
                    {selectedVideo?.name && <span className="hover:bg-violet-100 cursor-pointer text-sm px-2 py-1 bg-violet-200 rounded-md">{selectedVideo.name}</span>}
                    <div className="flex items-center bg-yellow-400 rounded-md py-1 px-2 gap-1">
                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">حداکثر مجاز به ارسال یک فیلم با حداکثر ۱۰۰ مگابایت حجم و در فرمت های mp4 یا video هستید.</p>
                        <AiFillWarning size={25} />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="font-[Yekan-Medium] text-sm">روزهای مد نظر را انتخاب کنید</p>
                    <DatePicker
                        value={selectedPersianDays}
                        // @ts-ignore
                        onChange={setSelectedPersianDays}
                        calendar={persian}
                        locale={persian_fa}
                        hideYear
                        multiple
                        placeholder="Click here"
                    />
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">توضیحات</label>
                    <textarea rows={9} required dir="rtl" name="description" className="resize-none font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                </div>
                <button className="font-[Yekan-Medium] bg-violet-50 hover:bg-violet-200 active:bg-violet-200 active:scale-110 transition duration-200 rounded-md px-3 py-2 text-violet-700 disabled:pointer-events-none disabled:text-gray-400" disabled={isLoading} >{isLoading ? "لطفا تا پایان بارگذاری فایل ها منتظر بمانید" : "ثبت آگهی"}</button>
                {formError && <p dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</p>}
            </form>
        </div>
    )
}

export default Page;