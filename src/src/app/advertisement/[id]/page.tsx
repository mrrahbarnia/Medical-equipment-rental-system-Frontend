"use client"
import { BiVideo } from "react-icons/bi";
import { BsImages } from "react-icons/bs"; 
import { AiFillWarning } from "react-icons/ai"; 
import axios from "axios";
import { AiFillCalendar } from "react-icons/ai"; 
import { IoIosPricetags } from "react-icons/io"; 
import { ImLocation } from "react-icons/im"; 
import { BiArrowBack } from "react-icons/bi"; 
import { TbFileDescription } from "react-icons/tb"; 
import { usePublicDetailAd } from "@/hooks/useAdDetail";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { errorHandler } from "@/utils/messageUtils";
import { convertEnglishNumberToPersian } from "@/utils/convertNumberToPersian";
import React, { useEffect, useState, Suspense, Fragment } from "react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import { useAuth } from "@/contexts/authProvider";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const INTERNAL_SHOW_PHONE_NUMBER_API: string = "/apis/show-phone-number/"

const Page = ({params}: {params: {id: string}}) => {
    const auth = useAuth();
    const router = useRouter();
    const {data, isError, isPending} = usePublicDetailAd(params.id)
    const [showPhoneNumberError, setShowPhoneNumberError] = useState<string>("")
    const [showPhoneNumber, setShowPhoneNumber] = useState<string | undefined>("")
    const [showImagesSlider, setShowImagesSlider] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const backHandler = () => {
        return router.back()
    }
    if (isPending) {
        return <div className="h-screen flex items-center justify-center">
                <p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p>
            </div>
    }

    if (isError) {
        return <div className="h-screen flex items-center justify-center">
                <p className="bg-red-600 py-2 text-white px-3 rounded-lg font-[Yekan-Bold]">مسیر اشتباه</p>
            </div>
    }

    const showPhoneNumberHandler = () => {
        setIsLoading(true);
        axios.get(`${INTERNAL_SHOW_PHONE_NUMBER_API}/${data?.id}`
        ).catch((error) => {
            if (error.status === 401) {
                auth.logout()
                setIsLoading(false);
                errorHandler("برای مشاهده شماره موبایل اجاره دهنده ابتدا بایستی وارد حساب کاربری خود شوید.", setShowPhoneNumberError)
                return;
            }
            if (error.status === 403) {
                setIsLoading(false);
                errorHandler("تعداد دفعات مشاهده شماره موبایل اجاره دهنده ها بیشتر از حد مجاز شده است.", setShowPhoneNumberError)    
                return;
            }
        }).then((response) => {
            setIsLoading(false);
            setShowPhoneNumber(response?.data.phoneNumber);
            return;
        })
    }
    
    return  (
            <Fragment>
                <div className="pt-36">
                    <div className="ml-4 mb-8 flex items-center gap-1 bg-violet-400 w-fit px-1 py-1 rounded-lg cursor-pointer hover:scale-110 transition duration-300  shadow-md shadow-black">
                        <BiArrowBack size={20} />
                        <button onClick={backHandler} className="font-[Yekan-Medium]" type="button">بازگشت</button>
                    </div>
                    <div className="flex flex-col items-end bg-gradient-to-l from-white to-gray-200 rounded-md shadow-lg px-2 py-3 w-11/12 mx-auto gap-3">
                        <h1 className="text-lg font-[Yekan-Bold] text-right">{data?.title}</h1>
                        <p className="text-white font-[Yekan-Medium] text-sm bg-green-600 w-fit py-1 px-2 rounded-md">دسته بندی:{data?.categoryName}</p>
                        <div className="w-full flex flex-col md:flex-row items-end md:items-start gap-3">
                            {data && <div className="w-full">
                                <Suspense fallback={<p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p>}>
                                    <Image onClick={() => setShowImagesSlider(true)} className="cursor-pointer rounded-lg w-full object-cover " src={data?.imageUrls[0]} width={500} height={500} alt={`${data?.title} image`} />
                                </Suspense>
                            </div>}
                            <div className="w-full flex flex-col gap-2 items-end">
                                <div className="flex flex-col items-end gap-1 bg-yellow-400 rounded-md py-1 px-2">
                                    <div className="flex items-center gap-2">
                                        <p dir="rtl" className="font-[Yekan-Medium] text-xs">
                                            {!showPhoneNumber ? "شما در مشاهده شماره موبایل اجاره دهنده ها محدودیت روزانه و ماهانه دارید." : "شماره موبایل اجاره دهنده ها بصورت یکبار مصرف نمایش داده میشود,در صورت نیاز آن را ذخیره کنید."}
                                        </p>
                                        <AiFillWarning size={25} />
                                    </div>
                                    {!showPhoneNumber ? <button onClick={showPhoneNumberHandler} className="w-fit text-sm font-[Yekan-Medium] bg-violet-600 hover:bg-violet-400 active:scale-110 px-2 py-1 text-white rounded-md transition duration-200" type="button">{isLoading ? "صبر کنید" : "مشاهده شماره موبایل"}</button> : <span className="text-white font-mono bg-violet-600 px-2 py-1 rounded-md">{showPhoneNumber}</span>}
                                    {showPhoneNumberError && <p dir="rtl" className="text-right px-2 py-1 bg-red-600 rounded-md text-white text-xs font-[Yekan-Medium]">{showPhoneNumberError}</p>}
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="font-[Yekan-Medium]">توضیحات</span>
                                    <TbFileDescription size={25} />
                                </div>
                                <p className="w-full leading-5 text-gray-600 bg-white rounded-md p-2 text-right font-[Yekan-Medium] text-xs md:text-sm">{data?.description}</p>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="text-xs md:text-sm font-[Yekan-Medium]">{data?.place}</span>
                                    <ImLocation size={18} />
                                </div>
                                <div className="flex w-full flex-col items-end gap-1 bg-gradient-to-r from-violet-300 to-violet-100 py-2 px-3 rounded-md">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="text-sm font-[Yekan-Medium]">قیمت ها</span>
                                        <IoIosPricetags size={18} />
                                    </div>
                                    {data?.hourPrice && <p className="font-[Yekan-Medium] text-xs">قیمت ساعتی:{convertEnglishNumberToPersian(Number(data?.hourPrice))} تومان</p>}
                                    {data?.dayPrice && <p className="font-[Yekan-Medium] text-xs">قیمت روزانه:{convertEnglishNumberToPersian(Number(data?.dayPrice))} تومان</p>}
                                    {data?.weekPrice && <p className="font-[Yekan-Medium] text-xs">قیمت هفتگی:{convertEnglishNumberToPersian(Number(data?.weekPrice))} تومان</p>}
                                    {data?.monthPrice && <p className="font-[Yekan-Medium] text-xs">قیمت ماهانه:{convertEnglishNumberToPersian(Number(data?.monthPrice))} تومان</p>}
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="text-sm font-[Yekan-Medium]">روزهای قابل اجاره</span>
                                    <AiFillCalendar size={18} />
                                </div>
                                {data && <div>
                                    <Calendar
                                    // @ts-ignore
                                    value={data.days}
                                    calendar={persian}
                                    locale={persian_fa}
                                    hideYear
                                />
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                {showImagesSlider && <div className="h-screen w-full z-50 overflow-scroll fixed right-0 top-0">
                    <div className="rounded-lg px-1 pb-16 w-full mx-auto my-10 relative">
                        <button onClick={() => setShowImagesSlider(false)} className="text-red-600 bg-white py-2 px-4 active:bg-red-600 active:text-white hover:bg-red-600 hover:text-white rounded-full absolute right-4 top-4 font-bold">X</button>
                        <div className="flex flex-col pt-14 gap-3">
                            <div className="flex items-center gap-2 justify-end">
                                <span className="font-[Yekan-Medium]">تصاویر</span>
                                <BsImages size={20} />
                            </div>
                            
                            <Swiper
                                navigation
                                pagination={{type: "fraction"}}
                                modules={[Navigation, Pagination]}
                                className='max-h-96 w-full rounded-lg'
                            >
                                {data?.imageUrls.map((imageUrl) => (
                                    <SwiperSlide key={imageUrl}>
                                        <div className='flex h-full w-full items-center justify-center'>
                                            <Suspense fallback={<p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p>}>
                                                <Image
                                                    className="object-contain max-h-80"
                                                    width={500} height={500} 
                                                    src={imageUrl} alt={`${data.title} image`}
                                                />
                                            </Suspense>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {data?.video && <div className="flex items-center gap-2 justify-end">
                                <span className="font-[Yekan-Medium]">ویدئو</span>
                                <BiVideo size={25} />
                            </div>}
                            {data?.video && <video className="max-h-80 bg-transparent w-full object-contain rounded-lg" width={500} controls muted playsInline height={500} ><source src={data?.video} />مرورگر شما تگ های ویدئو را پشتیبانی نمیکند</video>}
                        </div>
                    </div>
                </div>}
                {showImagesSlider && <div className="z-30 fixed left-0 top-0 w-full h-full bg-black opacity-90"></div>}
            </Fragment>
        )
};

export default Page;
