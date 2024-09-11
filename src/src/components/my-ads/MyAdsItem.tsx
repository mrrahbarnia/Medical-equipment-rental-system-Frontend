"use client"
import { MdOutlineDangerous } from "react-icons/md";
import { Fragment, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TiInputChecked } from "react-icons/ti"; 
import { MdUnpublished } from "react-icons/md"; 
import Image from "next/image";
import useDeleteMyAd from "@/hooks/useDeleteMyAd";
import { MyAdsType } from "@/hooks/useMyAds";
import { convertEnglishNumberToPersian } from "@/utils/convertNumberToPersian";

const MyAdsItem = ({ad}: {key: string, ad: MyAdsType}) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const {mutateAsync} = useDeleteMyAd();

    const deleteAdHandler = (id: string) => {
        mutateAsync(id).then(() => setIsOpenModal(false))
    }

    return (
        <Fragment>
            {isOpenModal && <div className="flex flex-col z-50 bg-white rounded-lg h-56 items-center justify-center gap-7 w-fit">
                <div className="flex items-center justify-center gap-1 p-3">
                    <p dir="rtl" className="font-[Yekan-Medium] overflow-hidden">آیا قصد پاک کردن آگهی با عنوان <span className="w-28 whitespace-normal overflow-hidden text-ellipsis font-[Yekan-Black] text-red-600">{ad.title}</span> را دارید؟</p>
                    <MdOutlineDangerous size={25} className="text-red-600" /> 
                </div>
                <div className="flex items-center gap-2">
                    <button className="font-[Yekan-Medium] bg-green-50 text-green-600 px-6 py-1 rounded-md hover:bg-green-200 active:bg-green-200" onClick={() => setIsOpenModal(false)}>خیر</button>
                    <button className="font-[Yekan-Black] bg-red-50 text-red-500 px-6 py-1 rounded-md hover:bg-red-200 active:bg-red-200" onClick={() => deleteAdHandler(ad.id)}>بله</button>
                </div>
            </div>}
            <div className="relative shadow-md h-auto gap-1 flex items-center p-2 rounded-md justify-end whitespace-normal break-words overflow-hidden">
                <button type="button" onClick={() => setIsOpenModal(true)} className="z-20 absolute top-2 left-2 bg-red-50 hover:bg-red-200 active:bg-red-200 transition-colors p-2 rounded-md text-red-500 ">
                    <AiOutlineDelete size={25} />
                </button>
                <div className="flex flex-col gap-2 h-32 w-full items-end">
                    <p className="font-[Yekan-Medium] text-base">{ad.title}</p>
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
                <Image className="bg-white w-32 h-32 object-contain rounded-md" width={100} height={100} alt={ad.title} src={ad.image} />
            </div>
            {isOpenModal && <div className="fixed left-0 top-0 z-40 bg-black h-full w-full opacity-85"></div>}
        </Fragment>
    )
}

export default MyAdsItem;