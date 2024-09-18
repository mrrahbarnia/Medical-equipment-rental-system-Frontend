"use client"
import { FaCommentDots } from "react-icons/fa";
import { AiOutlineLoading3Quarters, AiFillCalendar, AiFillWarning } from "react-icons/ai";
import { MdOutlineDeleteOutline, MdOutlineDeleteForever, MdOutlineDangerous } from "react-icons/md";
import { BiVideo, BiArrowBack } from "react-icons/bi";
import { BsImages } from "react-icons/bs"; 
import { IoIosPricetags } from "react-icons/io"; 
import { ImLocation } from "react-icons/im"; 
import { TbFileDescription } from "react-icons/tb"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { convertEnglishNumberToPersian } from "@/utils/convertNumberToPersian";
import React, { useState, Suspense, Fragment, useEffect } from "react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useAuth } from "@/contexts/authProvider";
import usePublishAd from "@/hooks/usePublishAd";
import useUnpublishAd from "@/hooks/useUnpublishAd";
import useDeleteAd from "@/hooks/useDeleteAd";
import usePostAdminComment from "@/hooks/usePostAdminComment";
import { errorHandler } from "@/utils/messageUtils";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useAdminAdDetail from "@/hooks/useAdminAdDetail";
import MapComponent from "@/components/map/Map";


const Page = ({params}: {params: {id: string}}) => {
    const auth = useAuth();
    const router = useRouter();
    const {data, isError, isPending} = useAdminAdDetail(params.id);
    const [showImagesSlider, setShowImagesSlider] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [adminCommentValue, setAdminCommentValue] = useState<string>();
    const {publishedMutate} = usePublishAd()
    const {UnpublishedMutate} = useUnpublishAd()
    const {deleteMutate, deletePending} = useDeleteAd();
    const {adminCommentAsyncMutate} = usePostAdminComment();
    const [commentFeedBack, setCommentFeedBack] = useState<string>("");

    useEffect(() => {
        auth.adminPages();
    }, [auth])

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

    const publishedHandler = (id: string) => {
        publishedMutate(id);
    }

    const unPublishedHandler = (id: string) => {
        UnpublishedMutate(id);
    }

    const deleteHandler = (id: string) => {
        deleteMutate(id).then(() => setIsOpenModal(false));
        return router.replace("/admin/")
    }

    const adminCommentHandler = (id: string) => {
        adminCommentAsyncMutate({adminComment: adminCommentValue, id: id}).then(() => {
            errorHandler("نظر شما با موفقیت ثبت شد.", setCommentFeedBack);
        }).catch(() => {auth.logout()});
    }

    return  (
            <Fragment>
                {isOpenModal && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg h-56 flex flex-col items-center justify-center gap-7 w-80">
                    <div className="flex items-center justify-center gap-1 p-3">
                        <p dir="rtl" className="font-[Yekan-Medium] overflow-hidden">مطمئن هستید؟</p>
                        <MdOutlineDangerous size={25} className="text-red-600" /> 
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="font-[Yekan-Medium] bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200" onClick={() => setIsOpenModal(false)}>خیر</button>
                        <button className="font-[Yekan-Black] bg-red-50 text-red-500 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200" onClick={() => deleteHandler(params.id)}>{!deletePending ? "بله" : <AiOutlineLoading3Quarters size={22} className="animate-spin" />}</button>
                    </div>
                </div>}
                <div className="pt-36">
                    <div className="ml-4 mb-8 flex items-center gap-1 bg-violet-400 w-fit px-1 py-1 rounded-lg cursor-pointer hover:scale-110 transition duration-300  shadow-md shadow-black">
                        <BiArrowBack size={20} />
                        <button onClick={backHandler} className="font-[Yekan-Medium]" type="button">بازگشت</button>
                    </div>
                    <div className="flex flex-col items-end bg-gradient-to-l from-white to-gray-200 rounded-md shadow-lg px-2 py-3 w-11/12 mx-auto gap-3">
                        <h1 className="text-lg font-[Yekan-Bold] text-right">{data?.title}</h1>
                        <div className="flex w-full justify-between">
                            <div className="flex flex-col gap-1 items-start">
                                <button type="button" className="p-1 bg-red-50 hover:bg-red-200 active:bg-red-200 transition-colors text-red-500 rounded-md" onClick={() => setIsOpenModal(true)}><MdOutlineDeleteOutline size={25} /></button>
                                {!data?.published && <button type="button" className="font-[Yekan-Medium] p-1 bg-violet-100 hover:bg-violet-300 active:bg-violet-300 transition-colors text-violet-800 rounded-md" onClick={() => publishedHandler(params.id)}>انتشار</button>}
                                {data?.published && <button type="button" className={`font-[Yekan-Medium] p-1 bg-yellow-100 hover:bg-yellow-300 active:bg-yellow-300 transition-colors text-yellow-800 rounded-md`} onClick={() => unPublishedHandler(params.id)}>لغو انتشار</button>}
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <p className="text-white font-[Yekan-Medium] text-sm bg-green-600 w-fit py-1 px-2 rounded-md">دسته بندی:{data?.categoryName}</p>
                                <p className={`text-white font-[Yekan-Medium] text-sm  w-fit py-1 px-2 rounded-md ${data?.published ? "bg-green-600" : "bg-red-600" }`}>{data?.published ? "منتشر شده" : "منتشر نشده" }</p>
                                <div className={`flex items-center gap-1 ${data?.isDeleted ? "bg-red-600" : "bg-green-600" } py-1 px-2 rounded-md text-white`}>
                                    <p className="font-[Yekan-Medium] text-sm w-fit">{data?.isDeleted ? "پاک شده" : "پاک نشده" }</p>
                                    {data?.isDeleted && <MdOutlineDeleteOutline size={20} />}
                                    {!data?.isDeleted && <MdOutlineDeleteForever size={20} />}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col min-[885px]:flex-row items-end md:items-start gap-3">
                            {data && <div className="w-full">
                                <Suspense fallback={<p className="rounded-full border-8 w-10 h-10 border-slate-600 border-solid border-t-transparent animate-spin m-auto"></p>}>
                                    <Image onClick={() => setShowImagesSlider(true)} className="cursor-pointer rounded-lg w-full object-cover " src={data?.imageUrls[0]} width={500} height={500} alt={`${data?.title} image`} />
                                </Suspense>
                            </div>}
                            <div className="w-full flex flex-col gap-2 items-end whitespace-normal break-words overflow-hidden">
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="font-[Yekan-Medium]">توضیحات</span>
                                    <TbFileDescription size={25} />
                                </div>
                                <p dir="rtl" className="w-full leading-5 text-gray-600 bg-white rounded-md p-2 text-right font-[Yekan-Medium] text-xs md:text-sm">{data?.description}</p>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="text-xs md:text-sm font-[Yekan-Medium]">{data?.place}</span>
                                    <ImLocation size={18} />
                                </div>
                                {data?.latLon && <MapComponent className="w-96 h-96 z-0" clickable={false} selectedLocation={data?.latLon} />}
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
                                    readOnly
                                />
                                </div>}
                                <div className="bg-gradient-to-r from-violet-300 to-violet-100 py-2 px-3 rounded-md w-full flex flex-col gap-1 items-end font-[Yekan-Medium]">
                                    <div className="flex items-baseline gap-1">
                                        <label className="text-sm">نظر ادمین</label>
                                        <FaCommentDots size={18} />
                                    </div>
                                    <textarea defaultValue={data?.adminComment ? data.adminComment : ""} onChange={(e) => setAdminCommentValue(e.target.value)} className="w-full resize-none rounded-md outline-1 py-2 px-3 text-sm" dir="rtl" rows={5}/>
                                    {data && <button onClick={() => adminCommentHandler(data?.id)} className="w-[200px] mx-auto text-center bg-violet-50 hover:bg-violet-100 active:bg-violet-100 text-violet-800 px-5 py-1 rounded-md">ثبت نظر</button>}
                                    {adminCommentValue && adminCommentValue?.length >= 1 && <div className="flex items-center gap-1 bg-yellow-400 rounded-md py-1 px-2">
                                        <p className="font-[Yekan-Medium] text-xs" dir="rtl">در صورت ثبت نظر جدید برای یک آگهی,بصورت پیش فرض آگهی از حالت انتشار خارج خواهد شد.</p>
                                        <AiFillWarning size={18} />
                                    </div>}
                                    {commentFeedBack && <p dir="rtl" className="bg-green-700 leading-6 px-3 py-1 rounded-md text-white text-xs w-full">{commentFeedBack}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpenModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
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
                                                    className="object-cover"
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
