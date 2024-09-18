"use client"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useGetMyAdDetail from "@/hooks/useGetMyAdDetail";
import { MdOutlineDangerous } from "react-icons/md";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import DatePicker, { Calendar } from "react-multi-date-picker";
import axios from "axios";
import { AiFillWarning } from "react-icons/ai";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { EXTERNAL_BASE_ENDPOINTS } from "@/configs/default";
import Image from "next/image";
import dayjs from 'dayjs';
import { errorHandler } from "@/utils/messageUtils";
import { useAuth } from "@/contexts/authProvider";
import { useRouter } from "next/navigation";
import MapComponent from "@/components/map/Map";

const INTERNAL_UPDATE_MY_ADVERTISEMENT_API: string = "/apis/my-advertisement/update/"

const Page = ({params}: {params: {id: string}}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openCategoriesMenu, setOpenCategoriesMenu] = useState<boolean>(false);
    const [categoryValue, setCategoryValue] = useState<string>("")
    const [debouncedCategory, setDebouncedCategories] = useState<string>();
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState<File>();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previousVideo, setPreviousVideo] = useState<string | null>();
    const [previousImages, setPreviousImages] = useState<string[]>([]);
    const [selectedPersianDays, setSelectedPersianDays] = useState<string[]>([]);
    const [formError, setFormError] = useState<string>("");
    const [categoriesResponse, setCategoriesResponse] = useState<string[]>([]);
    const [fullRangeDays, setFullRangeDays] = useState<Date []>([]);
    const [selectedFormattedDays, setSelectedFormattedDays] = useState<string[]>([]);
    const {data, error, isPending} = useGetMyAdDetail(params.id);
    const auth = useAuth();
    const router = useRouter();
    const [selectedLocation, setSelectedLocation] = useState<L.LatLngExpression | null>(null); 

    useEffect(() => {
        if (data) {
            setCategoryValue(data.categoryName)
            setPreviousImages(data.imageUrls)
            setPreviousVideo(data.video)
        }
    }, [data])

    const getFullDateRange = (start: Date, end: Date) => {
        const dates: Date[] = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const handleDateChanges = (dates: any[]) => {
        setSelectedPersianDays(dates);
        if (dates && dates.length > 1) {
            const { day: startedDay, month: startedMonth, year: startedYear } = dates[0];
            const startedDate = new Date(startedYear, startedMonth.number - 1, startedDay);

            const { day: endDay, month: endMonth, year: endYear } = dates[1];
            const endDate = new Date(endYear, endMonth.number - 1, endDay);
            setFullRangeDays(getFullDateRange(startedDate, endDate))
        }
        if (dates && dates.length === 1) {
            const { day: startedDay, month: startedMonth, year: startedYear } = dates[0];
            const startedDate = new Date(startedYear, startedMonth.number - 1, startedDay);
            setFullRangeDays([startedDate])
        }
    }

    useEffect(() => {
        if (fullRangeDays && fullRangeDays.length > 0) {
            const formattedDays = fullRangeDays.map((persianDay: any)=> {
                return dayjs(persianDay).format('YYYY-MM-DD')
            });
            setSelectedFormattedDays(formattedDays);
        }
    }, [fullRangeDays])


    const formSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        // @ts-ignore
        const formData = new FormData(event.target);
        // @ts-ignore
        selectedFormattedDays.length > 1 ? formData.append("days", selectedFormattedDays) : formData.append("days", data?.days) ;
        formData.append("previousImages", JSON.stringify(previousImages))
        formData.append("previousVideo", JSON.stringify(previousVideo))
        if (selectedLocation) {
            // @ts-ignore
            const lat = selectedLocation.lat
            // @ts-ignore
            const lng = selectedLocation.lng
            formData.append("latLon", JSON.stringify([lat,lng]))
        }
        const formEvent = event.target as HTMLFormElement
        if (formEvent.place.value === "" && !selectedLocation) {
            errorHandler("آدرس یا باید بصورت دستی وارد شود یا برای دقت بیشتر روی نقشه انتخاب شود.", setFormError)
            setIsLoading(false);
            return;
        }
        axios.put(
            `${INTERNAL_UPDATE_MY_ADVERTISEMENT_API}${params.id}`, formData
        )
        .then(
            () => {
                setIsLoading(false);
                return router.replace("/my-advertisement/");
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
            if (error.response.data && error.response.data.detail === "Advertisement must has at least one image!") {
                errorHandler("هر آگهی باید حداقل یک عکس داشته باشد.", setFormError)
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail === "Advertisement at least has 3 images!") {
                errorHandler("حداکثر مجاز به بارگذاری سه عکس میباشید.", setFormError);
                setIsLoading(false);
                return;
            }
            if (error.response.data && error.response.data.detail.includes("Video format must be in")) {
                errorHandler("فرمت فیلم بارگذاری شده باید mp4 یا video باشد.", setFormError);
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
        });
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
        setCategoryValue(event.target.value)
        if (event.target.value.length >= 2) {
            setOpenCategoriesMenu(true);
        } else {
            setOpenCategoriesMenu(false);
        }
    }

    const selectCategoryHandler = (category: string) => {
        setCategoryValue(category);
        setOpenCategoriesMenu(false);
    }

    const deletePreviousImage = (imageUrl: string) => {
        setPreviousImages((lastState) => lastState.filter((url) => url !== imageUrl))
    }

    if (isPending) {
        return <div className="h-screen flex items-center justify-center">
                <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p>
            </div>
    }

    if (error?.response?.data?.detail === "Could not validate credentials") {
        auth.logout();
        return <div className="h-screen flex items-center justify-center">
                <p className="bg-red-600 py-2 text-white px-3 rounded-lg font-[Yekan-Bold]">برای دسترسی به این صفحه ابتدا باید وارد حساب کاربری خود شوید.</p>
            </div>
    }

    if (error) {
        return <div className="h-screen flex items-center justify-center">
                <p className="bg-red-600 py-2 text-white px-3 rounded-lg font-[Yekan-Bold]">مسیر اشتباه.</p>
            </div>
    }

    return (
        <div className="pt-44 w-full px-2 m-auto min-[475px]:w-4/5 min-[640px]:w-3/5 min-[900px]:w-2/5">
            <form encType="multipart/form-data" className="bg-gradient-to-b from-white to-gray-200 w-full py-16 px-6 rounded-lg shadow-lg flex flex-col gap-6" onSubmit={formSubmitHandler}>
                <h1 className="font-[Yekan-Bold] text-lg mx-auto">فرم ویرایش آگهی</h1>
                <p className="text-gray-500 font-[Yekan-Medium] text-xs leading-6" dir="rtl">لطفا فقط اطلاعات مورد نظر را تغییر دهید.</p>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">عنوان آگهی</label>
                    <input dir="rtl" type="text" name="title" defaultValue={data?.title} required className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">آدرس</label>
                    <input dir="rtl" defaultValue={data?.place} type="text" name="place" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                    <p dir="rtl" className="font-[Yekan-Medium] text-gray-500 text-xs">آدرس را یا بصورت دستی ویرایش کنید یا روی نقشه آدرس جدید را انتخاب کنید.</p>
                    <div className="flex items-center bg-yellow-400 rounded-md py-1 px-2 gap-1">
                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">برای ثبت دقیق آدرس بهتر است از نقشه استفاده کنید.</p>
                        <AiFillWarning size={25} />
                    </div>
                    <MapComponent 
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        className="w-full h-96"
                        clickable={true} 
                    />
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">دسته بندی</label>
                    <input
                        dir="rtl" type="text" name="categoryName" required 
                        className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"
                        value={categoryValue}
                        onChange={categoryAutoCompleteHandler}
                    />
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
                        <input defaultValue={data?.hourPrice ? Number(data?.hourPrice) : undefined} dir="rtl" type="number" placeholder="قیمت ساعتی(تومان)" name="hourPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                        <input defaultValue={data?.dayPrice ? Number(data?.dayPrice) : undefined}  dir="rtl" type="number" placeholder="قیمت روزانه(تومان)" name="dayPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                        <input defaultValue={data?.weekPrice ? Number(data?.weekPrice) : undefined} dir="rtl" type="number" placeholder="قیمت هفتگی(تومان)" name="weekPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full" />
                        <input defaultValue={data?.monthPrice ? Number(data?.monthPrice) : undefined} dir="rtl" type="number" placeholder="قیمت ماهانه(تومان)" name="monthPrice" className="font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label htmlFor="image" className="block text-sm py-2 px-4 rounded-md border-0 bg-violet-50 text-violet-700 hover:bg-violet-200 cursor-pointer font-[Yekan-Medium]">{selectedImages.length < 3 ? "بارگذاری عکس های جدید" : "سقف فایل های ارسالی"}</label>
                    {/* @ts-ignore */}
                    {selectedImages.length !== 0 && selectedImages[0].length !== 0 && <p className="font-[Yekan-Medium] text-sm px-2 py-1 bg-violet-200 rounded-md">تعداد عکس های انتخاب شده : {selectedImages[0].length}</p>}
                    {/* @ts-ignore */}
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
                    {previousImages.length > 0 && <div className="flex flex-col items-end gap-2 bg-white rounded-md w-full p-1">
                        <p className="font-[Yekan-Medium] text-sm text-violet-700">عکس های قبلی</p>
                        <div className="flex items-center justify-end gap-3 w-full">
                            {previousImages.map(imageUrl => 
                                <div key={imageUrl} className="relative overflow-x-hidden">
                                    <span className="absolute right-1 top-1 text-red-600 bg-red-50 hover:bg-red-300 active:bg-red-300 cursor-pointer rounded-full text-xs px-1" onClick={() => deletePreviousImage(imageUrl)}>X</span>
                                    <Image className="bg-transparent rounded-md object-contain max-h-16 max-w-60" src={imageUrl} alt={imageUrl} width={100} height={100} />
                                </div>
                            )}
                        </div>
                    </div>}
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label htmlFor="video" className="block text-sm py-2 px-4 rounded-md border-0 bg-violet-50 text-violet-700 hover:bg-violet-200 cursor-pointer font-[Yekan-Medium]">بارگذاری فیلم جدید</label>
                    {/* @ts-ignore */}
                    <input type="file" id="video" name="video" hidden onChange={(e) => setSelectedVideo(e.target.files[0])}/>
                    {selectedVideo?.name && <span className="hover:bg-violet-100 cursor-pointer text-sm px-2 py-1 bg-violet-200 rounded-md">{selectedVideo.name}</span>}
                    <div className="flex items-center bg-yellow-400 rounded-md py-1 px-2 gap-1">
                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">حداکثر مجاز به ارسال یک فیلم با حداکثر ۱۰۰ مگابایت حجم و در فرمت های mp4 یا video هستید.</p>
                        <AiFillWarning size={25} />
                    </div>
                    {data?.video && <div className="flex flex-col items-end gap-2 bg-white rounded-md w-full p-1">
                        <p className="font-[Yekan-Medium] text-sm text-violet-700">فیلم قبلی</p>
                        <video className="bg-transparent max-h-16 object-contain rounded-md max-w-60" width={100} muted playsInline height={100} ><source src={data?.video} />مرورگر شما تگ های ویدئو را پشتیبانی نمیکند</video>
                    </div>}
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="font-[Yekan-Medium] text-sm">روزهای انتخاب شده ی قبلی</p>
                    <Calendar
                        // @ts-ignore
                        value={data?.days}
                        calendar={persian}
                        locale={persian_fa}
                        hideYear
                        readOnly
                    />
                    <p className="font-[Yekan-Medium] mt-5 text-sm">اینجا روزهای مد نظر را بروزرسانی کنید</p>
                    <DatePicker
                        value={selectedPersianDays}
                        // @ts-ignore
                        onChange={handleDateChanges}
                        calendar={persian}
                        locale={persian_fa}
                        hideYear
                        placeholder="Click here"
                        range
                    />
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <label className="font-[Yekan-Medium]">توضیحات</label>
                    <textarea defaultValue={data?.description} rows={9} required dir="rtl" name="description" className="resize-none font-[Yekan-Medium] rounded-md border-2 outline-1 py-2 px-3 w-full"/>
                </div>
                <button className="font-[Yekan-Medium] bg-violet-50 hover:bg-violet-200 active:bg-violet-200 active:scale-110 transition duration-200 rounded-md px-3 py-2 text-violet-700 disabled:pointer-events-none disabled:text-gray-400" disabled={isLoading} >{isLoading ? <AiOutlineLoading3Quarters size={20} className="animate-spin w-full text-center" /> : "ثبت تغییرات"}</button>
                {formError && <p dir="rtl" className="bg-red-600 leading-6 font-[Yekan-Medium] text-right p-3 rounded-md text-white text-xs">{formError}</p>}
            </form>
        </div>
    )
}

export default Page;