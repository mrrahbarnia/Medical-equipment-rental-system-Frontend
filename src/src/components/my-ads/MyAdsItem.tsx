"use client"
import { MdOutlineDangerous } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { Fragment, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TiInputChecked } from "react-icons/ti"; 
import { MdUnpublished } from "react-icons/md"; 
import Image from "next/image";
import useDeleteMyAd from "@/hooks/useDeleteMyAd";
import { MyAdsType } from "@/hooks/useMyAds";
import { convertEnglishNumberToPersian } from "@/utils/convertNumberToPersian";
import Link from "next/link";

const MyAdsItem = ({ad}: {key: string, ad: MyAdsType}) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const {mutateAsync} = useDeleteMyAd();
    

    const deleteAdHandler = (id: string) => {
        mutateAsync(id).then(() => setIsOpenModal(false))
    }

    return (
        <Fragment>
            {isOpenModal && <div className="flex flex-col z-50 bg-white rounded-lg h-56 items-center justify-center gap-7 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80">
                <div className="flex items-center justify-center gap-1 p-3">
                    <p dir="rtl" className="font-[Yekan-Medium] overflow-hidden">آیا قصد پاک کردن آگهی با عنوان <span className="w-28 whitespace-normal overflow-hidden text-ellipsis font-[Yekan-Black] text-red-600">{ad.title}</span> را دارید؟</p>
                    <MdOutlineDangerous size={25} className="text-red-600" /> 
                </div>
                <div className="flex items-center gap-2">
                    <button className="font-[Yekan-Medium] bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200" onClick={() => setIsOpenModal(false)}>خیر</button>
                    <button className="font-[Yekan-Black] bg-red-50 text-red-500 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200" onClick={() => deleteAdHandler(ad.id)}>بله</button>
                </div>
            </div>}
            <div className={`relative shadow-md h-auto p-2 rounded-md whitespace-normal break-words overflow-hidden ${ad.adminComment && "bg-yellow-200"}`}>
                <div className="flex flex-col gap-1 z-20 absolute bottom-2 left-2">
                    <button type="button" onClick={() => setIsOpenModal(true)} className="bg-red-50 hover:bg-red-200 active:bg-red-200 transition-colors p-2 rounded-md text-red-500 ">
                        <AiOutlineDelete size={25} />
                    </button>
                    {ad.adminComment && <Link href={`/my-advertisement/update/${ad.id}/`} className="bg-yellow-50 hover:bg-yellow-200 active:bg-yellow-200 transition-colors p-2 rounded-md text-yellow-600">
                        <RxUpdate size={25} />
                    </Link>}
                </div>
                {ad.adminComment && <div className="bg-white px-2 py-1 rounded-md flex flex-col font-[Yekan-Medium] gap-1 items-end overflow-x-hidden text-ellipsis">
                    <h3>پیام مدیر</h3>
                    <hr className="border-1 border-gray-300 w-full"/>
                    <p dir="rtl" className="text-xs">{ad.adminComment}</p>
                </div>}
                <div className="flex items-center justify-end gap-1">
                    <div className="flex flex-col gap-2 h-auto w-full items-end">
                        <p className="text-right text-sm font-[Yekan-Medium]">{ad.title}</p>
                        <span className="text-white font-[Yekan-Medium] text-sm text-right bg-green-600 w-fit py-1 px-2 rounded-md">بازدید:{convertEnglishNumberToPersian(ad.views)}</span>

                            {ad.published ? <div className="flex items-center gap-1 text-white bg-green-600 rounded-md py-1 px-2 ">
                                <p className="font-[Yekan-Medium]">منتشر شده است</p>
                                <TiInputChecked size={25} />
                            </div> : 
                            <div className="flex items-center gap-1 text-white bg-yellow-500 rounded-md py-1 px-2 ">
                                <p className="font-[Yekan-Medium]">در حال بررسی</p>
                                <MdUnpublished size={25} />
                            </div>
                            }
                    </div>
                    <Image className={`w-32 h-32 object-contain rounded-md ${ad.adminComment ? "bg-yellow-200" : "bg-white"}`} width={100} height={100} alt={ad.title} src={ad.image} />
                </div>
                
            </div>
            {isOpenModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
}

export default MyAdsItem;